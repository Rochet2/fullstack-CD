if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.statics.format = function ({ name, number, _id }) {
  return {
    name,
    number,
    id: _id,
  }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person
