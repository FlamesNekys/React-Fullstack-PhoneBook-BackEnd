const express = require('express')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())

app.get('/api/persons', (req, res) => res.json(persons)
)

app.get('/info', (req, res) => {
    const date = new Date()
    const text = `<p>Phonebook has info for ${persons.length} people</p><p>${date.toString()}</p>`
    
    res.send(text)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) res.json(person)
    else res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

app.post('/api/persons', (req, res) => {
    const person = req.body
    if (!person.name || !person.number) return res.status(400).json({ 
        error: 'name or number is missing' 
      })
    if (persons.find(pers=> pers.name === person.name)) return res.status(400).json({ 
        error: 'name must be unique' 
      })
    person.id = getRandomInt(1000000)

    persons = persons.concat(person)

    res.json(person)
  })

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})