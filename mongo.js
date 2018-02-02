if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

if (process.argv.length === 4) {
  const [, , name, number] = process.argv
  console.log(`lisätään henkilö ${name} numero ${number} luetteloon`)

  mongoose.connect(url)
  mongoose.Promise = global.Promise

  const Person = mongoose.model('Person', {
    name: String,
    number: String,
  })

  const person = new Person({
    name,
    number,
  })

  person
    .save()
    .then(() => {
      console.log('henkilö lisätty!')
      mongoose.connection.close()
    })
}
else if (process.argv.length === 2) {
  mongoose.connect(url)
  mongoose.Promise = global.Promise

  const Person = mongoose.model('Person', {
    name: String,
    number: String,
  })

  Person
    .find({})
    .then(result => {
      result.forEach(p => {
        console.log(p)
      })
      mongoose.connection.close()
    })
}
else
  console.log('tuntematon komento')
