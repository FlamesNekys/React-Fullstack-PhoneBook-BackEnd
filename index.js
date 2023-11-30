require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const errorHandler = require('./errorHandler')

morgan.token('data', (req, res) => JSON.stringify(req.body))

app.use(express.static('static_build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (req, res, next) => Person.find({}).then(people => 
  res.json(people)
).catch(e => next(e)))

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Person({
      "name": body.name,
      "number": body.number
  })
  person.save().then(savedPerson => 
      res.json(savedPerson)
).catch(e => next(e))})

app.get('/info', (req, res) => {
    const date = new Date()
    Person.find({}).then(people => {
    const text = `<p>Phonebook has info for ${people.length} people</p><p>${date.toString()}</p>`
    res.send(text)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
  .then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .catch(e => next(e))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
      .then(result => res.status(204).end())
      .catch(e => next(e))
})

app.put('/api/persons/:id', (req, res, next) => {
  const {name, number} = req.body

Person.findByIdAndUpdate(req.params.id, {name, number}, {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => res.json(updatedPerson))
    .catch(e => next(e))
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use(errorHandler)