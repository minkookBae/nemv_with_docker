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

router.get('/read/:_id', (req, res, next) => {
  const _id = req.params._id

  let atc = {}
  
  Article.findByIdAndUpdate(_id, { $inc: { 'cnt.view': 1 } }, { new: true }).populate({path : '_user', select : 'name'}).lean()
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

router.all('*', function(req, res, next) {
  next(createError(404, '그런 api 없어'));
});

module.exports = router;