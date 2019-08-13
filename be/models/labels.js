const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)
const labelSchema = new mongoose.Schema({
  name : { type : String, defalut : '', unique : true, index : true},
  content: { type: String, default: '' }
  
})

module.exports = mongoose.model('Label', labelSchema)
