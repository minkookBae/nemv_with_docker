const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)
const commentSchema = new mongoose.Schema({
  content: { type: String, default: '' },
  cnt: {
    view: { type: Number, default: 0 },
  },
  is_statusChange : { type : Boolean, default : false},
  is_openIssue : { type : Boolean, default : false},
  ip: { type: String, default: '' },
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, default: null },
  _article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', index: true }
})

module.exports = mongoose.model('Comment', commentSchema)