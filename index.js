if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>
            <p>${new Date()}</p>`)
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'query failed' })
        })
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(Person.format))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'query failed' })
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(Person.format(person))
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }
    Person
        .findByIdAndUpdate(req.params.id, person, { new: true })
        .then(person => {
            res.json(Person.format(person))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: 'name missing' })
    }
    if (body.number === undefined) {
        return res.status(400).json({ error: 'number missing' })
    }

    Person
        .find({ name: body.name })
        .then(persons => {
            if (persons && persons.length != 0) {
                res.status(400).send({ error: `name "${body.name}" already exists` })
            } else {
                const person = new Person({
                    name: body.name,
                    number: body.number,
                })
                person
                    .save()
                    .then(person => {
                        res.json(Person.format(person))
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(400).send({ error: 'could not save' })
                    })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'could not save' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
