const mongoose = require('mongoose')
const url = 'mongodb://dbuser:secret@ds121088.mlab.com:21088/fullstackmongo'

if (process.argv.length === 4) {
    const [,, name, number] = process.argv
    console.log(`lisätään henkilö ${name} numero ${number} luetteloon`)

    mongoose.connect(url)
    mongoose.Promise = global.Promise;

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
        .then(response => {
            console.log('henkilö lisätty!')
            mongoose.connection.close()
        })
}
else if (process.argv.length === 2) {
    mongoose.connect(url)
    mongoose.Promise = global.Promise;

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
    console.log("tuntematon komento")
