const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)
const articleSchema = new mongoose.Schema({
  article_num : {type : Number , default : 1, index : true},
  is_open : {type: Boolean, default : true},
  title: { type: String, default: '', index: true },
  content: { type: String, default: '' },
  cnt: {
    view: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    dislike : { type: Number, default: 0}
  },
  ip: { type: String, default: '' },
  comments_count : {type : Number, default : 0},
  labels : [String],
  like_member : [String],
  is_reference : {type : Boolean, default : false},
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  _board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', index: true }
})

module.exports = mongoose.model('Article', articleSchema)
