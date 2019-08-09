var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Board = require('../../../models/boards')
const Article = require('../../../models/articles')

router.get('/list/:_board', (req, res, next) => {
  const _board = req.params._board
  // const { sort, order, skip, limit } = req.query
  //
  // if (sort === undefined || order === undefined ||  skip === undefined ||  limit === undefined) {
  //   return res.send({ success: false, msg: '잘못된 요청입니다' })
  // }

  const f = {}
  if (_board) f._board = _board

  Article.find(f).select('-content').populate('_user', '-pwd')
    .then(rs => {
      res.send({ success: true, ds: rs, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.get('/read/:_id', (req, res, next) => {
  const _id = req.params._id

  Article.findByIdAndUpdate(_id, { $inc: { 'cnt.view': 1 } }, { new: true })
    .select('content cnt.view')
    .then(r => {
      console.log(r)
      res.send({ success: true, d: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

// Article.deleteMany({}).then(r => console.log(r))

router.post('/:_board', (req, res, next) => {
  const _board = req.params._board
  if (!_board) return res.send({ success: false, msg: '게시판이 선택되지 않았습니다' }) // 나중에 400 bad request 처리 예제
  const { title, content } = req.body
  Board.findById(_board)
    .then(r => {
      if (!r) return res.send({ success: false, msg: '잘못된 게시판입니다' })
      if (r.lv < req.user.lv) return res.send({ success: false, msg: '권한이 없습니다' })
      const atc = {
        title,
        content,
        _board,
        ip: '1.1.1.1',//req.ip,
        _user: null
      }
      if (req.user._id) atc._user = req.user._id
      return Article.create(atc)
    })
    .then(r => {
      res.send({ success: true, d: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})


router.put('/:_id', (req, res, next) => {
  if (!req.user._id) return res.send({ success: false, msg: '게시물 수정 권한이 없습니다' })
  const _id = req.params._id

  Article.findById(_id)
    .then(r => {
      if (!r) throw new Error('게시물이 존재하지 않습니다')
      if (!r._user) throw new Error('손님 게시물은 수정이 안됩니다')
      if (r._user.toString() !== req.user._id) throw new Error('본인이 작성한 게시물이 아닙니다')
      return Article.findByIdAndUpdate(_id, { $set: req.body}, { new: true })
    })
    .then(r => {
      res.send({ success: true, d: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.delete('/:_id', (req, res, next) => {
  if (!req.user._id) return res.send({ success: false, msg: '게시물 수정 권한이 없습니다' })
  const _id = req.params._id

  Article.findById(_id).populate('_user', 'lv')
    .then(r => {
      if (!r) throw new Error('게시물이 존재하지 않습니다')
      if (!r._user) throw new Error('손님 게시물은 삭제가 안됩니다')
      if (r._user.toString() !== req.user._id) {
        if (r._user.lv < req.user.lv) throw new Error('본인이 작성한 게시물이 아닙니다')
      }
      return Article.deleteOne({ _id })
    })
    .then(r => {
      res.send({ success: true, d: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.all('*', function(req, res, next) {
  next(createError(404, '그런 api 없어'));
});

module.exports = router;