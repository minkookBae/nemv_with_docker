const mongoose = require('mongoose')
const cfg = require('../config')

mongoose.set('useCreateIndex', true)
const boardSchema = new mongoose.Schema({
  name: { type: String, default: '', index: true, unique: true },
  lv: { type: Number, default: 0 },
  rmk: { type: String, default: '' }
})

const Board = mongoose.model('Board',boardSchema)

Board.findOne({})
.then((r)=>{
  if(!r) {
    console.log("new board create")
    return Board.create({name : '아무나', lv : 3, rmk : '아무나게시판'})
  }
  return Promise.resolve(r)
})
.catch((e) =>{
  console.log(e.message)
})

module.exports = mongoose.model('Board', boardSchema)
