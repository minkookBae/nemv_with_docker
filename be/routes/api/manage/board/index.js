var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const Board = require('../../../../models/boards')

router.post('/', (req, res, next) => {
  const { name, lv, rmk } = req.body
  Board.create({ name, lv, rmk })
    .then(r => {
      res.send({ success: true, msg: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.get('/', function(req, res, next) {
  Board.find()
    .then(rs => {
      res.send({ success: true, ds: rs, token: req.token })
    })
    .catch(e => {
      res.send({ success: false })
    })
});

router.put('/:_id', (req, res, next) => {
  const _id = req.params._id
  Board.updateOne({ _id }, { $set: req.body})
    .then(r => {
      res.send({ success: true, msg: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.delete('/:_id', (req, res, next) => {
  const _id = req.params._id
  Board.deleteOne({ _id })
    .then(r => {
      res.send({ success: true, msg: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.put('/label/:_id', (req, res, next) => {
  const _id = req.params._id
  console.log(req.body)
  const labels_name = req.body.name
  Board.updateOne({ _id }, { $push: {labels : labels_name}})
    .then(r => {
      res.send({ success: true, msg: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

router.put('/label_del/:_id', (req, res, next) => {
  const _id = req.params._id
  const labels_name = req.body.name
  
  Board.updateOne({ _id }, { $pull: {labels : labels_name}})
    .then(r => {
      res.send({ success: true, msg: r, token: req.token })
    })
    .catch(e => {
      res.send({ success: false, msg: e.message })
    })
})

module.exports = router;
