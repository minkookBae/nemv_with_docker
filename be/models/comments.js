const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)
const commentSchema = new mongoose.Schema({
  content: { type: String, default: '' },
  cnt: {
    view: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 }
  },
  like_member : [String],
  ip: { type: String, default: '' },
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, default: null },
  _article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', index: true }
})

module.exports = mongoose.model('Comment', commentSchema)