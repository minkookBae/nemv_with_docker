var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Board = require('../../../models/boards')
const Comment = require('../../../models/comments')
const Article = require('../../../models/articles')


router.get('/list/:_board', (req, res, next) => {
  const _board = req.params._board
  let { search, sort, order, skip, limit } = req.query
  // console.log(req.query)
  // console.log(sort && order && skip && limit)
  // console.log(search & sort & order & skip & limit)
  if (!(sort && order && skip && limit)) throw createError(400, '잘못된 요청입니다')
  if (!search) search = ''
  order = parseInt(order)
  limit = parseInt(limit)
  skip = parseInt(skip)
  const s = {}
  s[sort] = order

  const f = {}
  if (_board) f._board = _board
  let total = 0

  Article.countDocuments(f)
    .where('title').regex(search)
    .then(r => {
      total = r
      return Article.find(f)
        .where('title').regex(search)
        .sort(s)
        .skip(skip)
        .limit(limit)
        .select('-content')
        .populate('_user', '-pwd')
    })
    .then(rs => {
      res.send({ success: true, t: total, ds: rs, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.get('/dashboard', (req, res, next) => {
  Article.find().sort({"_id" : -1}).limit(3).populate({path : "_user", select : "name"}).select('title content _user')
  .then(r => {
    res.send({success : true, ds : r, token : req.token})
  })
  .catch(e => {
    res.send({ success : false, msg : e.message})
  })
})

router.get('/dashboard2', (req, res, next) => {
  Article.find({"is_open" : true}).count()
  .then(r => {
    res.send({success : true, count : r, token : req.token})
  })
  .catch(e => {
    res.send({ success : false, msg : e.message})
  })
})

router.get('/dashboard4', (req, res, next) => {
  Article.find().select('cnt.view')
  .then(r => {
    res.send({success : true, d : r, token : req.token})
  })
  .catch(e => {
    res.send({ success : false, msg : e.message})
  })
})

router.get('/dashboard5', (req, res, next) => {
  Article.find().count()
  .then(r => {
    res.send({success : true, count : r, token : req.token})
  })
  .catch(e => {
    res.send({ success : false, msg : e.message})
  })
})

router.get('/read/:_id', (req, res, next) => {
  const _id = req.params._id

  let atc = {}
  
  Article.findByIdAndUpdate(_id, { $inc: { 'cnt.view': 1 } }, { new: true }).populate({path : '_user _board', select : 'name'}).lean()
    .then(r => {
      if(!r) throw new Error('잘못된 게시판입니다.')
      atc = r
      atc._comments = []
      return Comment.find({ _article: atc._id }).populate({ path: '_user', select: 'id name'}).sort({ _id: 1 }).limit(100)
    })
    .then(rs => {
      if (rs) atc._comments = rs
      res.send({ success: true, d: atc, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

// Article.deleteMany({}).then(r => console.log(r))

router.post('/:_board', (req, res, next) => {
  const _board = req.params._board
  if (!_board) throw createError(400, "게시판이 선택되지 않았습니다.")
  const { title, content } = req.body
  Board.findById(_board)
    .then(r => {
      if (!r) throw createError(400, "잘못된 게시판입니다.")
      if (r.lv < req.user.lv) throw createError(403,"권한이 없습니다.")
      const atc = {
        title,
        content,
        _board,
        labels : [],
        ip: '1.1.1.1',//req.ip,
        _user: null
      }
      if (req.user._id) atc._user = req.user._id
      return Article.create(atc)
    })
    .then(r => {
      if(!r) throw new Error("게시물이 생성되지 않았습니다.")
      res.send({ success: true, d: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})


router.put('/:_id', (req, res, next) => {
  if (!req.user._id) throw createError(403, "게시물 수정 권한이 없습니다.")
  const _id = req.params._id

  if(req.user.lv === 0){
    Article.findById(_id)
    .then(r => {
      if (!r) throw new Error('게시물이 존재하지 않습니다')
      return Article.findByIdAndUpdate(_id, { $set: req.body}, { new: true })
    })
    .then(r => {
      res.send({ success: true, d: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })    
  }

  else{
    Article.findById(_id).populate('_user', 'lv')
      .then(r => {
        if (!r) throw new Error('게시물이 존재하지 않습니다')
        if (!r._user){
          throw new Error('손님 게시물은 수정이 안됩니다')
        }
        else{
          if (r._user.toString() !== req.user._id) {
            if (r._user.lv < req.user.lv) throw new Error('본인이 작성한 게시물이 아닙니다')
          }
        }
        return Article.findByIdAndUpdate(_id, { $set: req.body}, { new: true })
      })
      .then(r => {
        res.send({ success: true, d: r, token: req.token })
      })
      .catch(e => {
        res.send({ success: false, msg: e.message })
      })
  }
})

router.delete('/:_id', (req, res, next) => {
  if (!req.user._id) throw createError(403, '게시물 삭제 권한이 없습니다')
  const _id = req.params._id

  if(req.user.lv === 0){
    Article.findById(_id)
      .then(r => {
        if (!r) throw new Error('게시물이 존재하지 않습니다')
        
        return Article.deleteOne({ _id })
      })
      .then(r => {
        res.send({ success: true, d: r, token: req.token })
      })
      .catch(e => {
        res.send({ success: false, msg: e.message })
      })
  }

  else{
    Article.findById(_id).populate('_user', 'lv')
      .then(r => {
        if (!r) throw new Error('게시물이 존재하지 않습니다')
        if (!r._user){
          throw new Error('손님 게시물은 삭제가 안됩니다')
        }
        else{
          if (r._user.toString() !== req.user._id) {
            if (r._user.lv < req.user.lv) throw new Error('본인이 작성한 게시물이 아닙니다')
          }
        }
        return Article.deleteOne({ _id })
      })
      .then(r => {
        res.send({ success: true, d: r, token: req.token })
      })
      .catch(e => {
        res.send({ success: false, msg: e.message })
      })
    }
})

router.put('/like/:_id', (req, res, next) => {
  if (!req.user._id) throw createError(403, "손님은 좋아요 표시를 할 수 없습니다")

  const _id = req.params._id
  const user_id = req.user._id
  Article.find({"_id" : _id})
  .then((r) =>{
    if(!r) throw new Error("게시글이 없습니다.")

    if(!r[0].like_member.includes(user_id) && !r[0].dislike_member.includes(user_id) )
      return Article.findByIdAndUpdate({_id : _id}, {$push : {like_member : user_id}}, {new : true})
    else if(r[0].dislike_member.includes(user_id) && !r[0].like_member.includes(user_id)){
      Article.findByIdAndUpdate({_id : _id}, {$pull : {dislike_member : user_id}}, {new : true})
      .then(r=>{return Article.findByIdAndUpdate({_id : _id}, {$push : {like_member : user_id}}, {new : true})})
      //싫어요 된게 있다면 싫어요 제거하고 좋아요로 이동
    }
    else if(r[0].like_member.includes(user_id) && !r[0].dislike_member.includes(user_id)){
      return Article.findByIdAndUpdate({_id : _id}, {$pull : {like_member : user_id}}, {new : true})
 
    }
  })
  .then(r=>{
    res.send({ success : true, token : req.token})
  })
  .catch(e =>{
    res.send({ success : false, msg : e.message })
  })
  
})
// 좋아요 구현

router.put('/dislike/:_id', (req, res, next) => {
  if (!req.user._id) throw createError(403, "손님은 싫어요 표시를 할 수 없습니다")

  const _id = req.params._id
  const user_id = req.user._id
  var user_id_array = []
  Article.find({"_id" : _id})
  .then((r) =>{
    if(!r) throw new Error("게시글이 없습니다.")

    if(!r[0].dislike_member.includes(user_id) && !r[0].like_member.includes(user_id))
      return Article.findByIdAndUpdate({_id : _id}, {$push : {dislike_member : user_id}}, {new : true})
    else if(r[0].like_member.includes(user_id) && !r[0].dislike_member.includes(user_id)){
      Article.findByIdAndUpdate({_id : _id}, {$pull : {like_member : user_id}}, {new : true})
      .then(r=>{return Article.findByIdAndUpdate({_id : _id}, {$push : {dislike_member : user_id}}, {new : true})})
      // 좋아요 된게 있다면 좋아요를 제거하고 싫어요에 추가
    }
    else if(r[0].dislike_member.includes(user_id) && !r[0].like_member.includes(user_id)){
      return Article.findByIdAndUpdate({_id : _id}, {$pull : {dislike_member : user_id}}, {new : true})
 
    }
  })
  .then(r=>{
    res.send({ success : true, token : req.token})
  })
  .catch(e =>{
    res.send({ success : false, msg : e.message })
  })
  
})
// 싫어요 구현

router.put('/status/:_id', (req, res, next) => {
  if (!req.user._id) throw createError(403, "게시물 수정 권한이 없습니다.")
  const _id = req.params._id

  if(req.user.lv === 0){
    Article.findById(_id)
    .then(r => {
      if (!r) throw new Error('게시물이 존재하지 않습니다')
      return Article.findByIdAndUpdate(_id, {is_open : !req.body.is_open}, { new: true })
    })
    .then(r => {
      res.send({ success: true, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })    
  }
  //관리자

  else{
    Article.findById(_id).populate('_user', 'lv')
      .then(r => {
        if (!r) throw new Error('게시물이 존재하지 않습니다')
        if (!r._user){
          throw new Error('손님 게시물은 수정이 안됩니다')
        }
        else{
          if (r._user._id.toString() !== req.user._id) {
            if (req.user.lv !== 0) {
              throw new Error('본인이 작성한 게시물이 아닙니다')
            }
          }
        }
        return Article.findByIdAndUpdate(_id, {is_open : !req.body.is_open}, { new: true })
      })
      .then(r => {
        res.send({ success: true, token: req.token })
      })
      .catch(e => {

        res.send({ success: false, msg: e.message })
      })
  }
})


router.get('/:_id', (req, res, next) =>{
  const _id = req.params._id
  console.log(_id)
  Article.findById(_id).select('labels')
  .then((r)=>{
    res.send({success : true, d : r, token : req.token})
  })
  .catch((e)=>{
    res.send({ success: false, msg: e.message })
  })
})

router.put(`/label/:_id`, (req, res, next) =>{
  const _id = req.params._id
  const data = req.body.register
  const temp = []
  for(var i = 0 ; i< data.length ; i ++){
    temp.push(data[i].data)
  }

  Article.findById(_id)
  .then(r => {
    if (!r) throw new Error('게시물이 존재하지 않습니다')
    if(!req.user) throw new Error('손님은 수정이 불가능합니다.')
    if(req.user.lv !== 0 ) throw new Error ('라벨링은 관리자만 가능합니다.')

    return Article.findByIdAndUpdate(_id, {labels : temp}, {new : true})
  })
  .then(rs =>{
    res.send({success : true, token : req.token})
  })
  .catch(e =>{
    res.send({ success: false, msg: e.message })
  })
})

// 라벨링 저장하기 API


router.all('*', function(req, res, next) {
  next(createError(404, '그런 api 없어'));
});

module.exports = router;