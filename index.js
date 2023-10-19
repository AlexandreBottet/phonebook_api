import express from "express"
const app = express();

import cors from 'cors';
import morgan from "morgan";

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'));

app.use(cors());

app.use(express.json());

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

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.post('/api/persons', (req, res) => {
    const body = req.body;

    const duplicateName = persons.some(person => person.name === body.name) 

    const person = {
        name: body.name,
        number: body.number,
        id: Math.round(Math.random() * 100)
    }

    if (!body.name) {
        res.status(404).send({
            error: 'name is missing'
        })
    } 
    else if (!body.number) {
        res.status(404).send({
            error: 'number is missing'
        })
    } 
    else if (duplicateName) {
        res.status(409).send({
            error: 'name must be unique'
        })
    } 
    else {
        persons = persons.concat(person);

        res.json(person);
    }
})

app.get('/api/persons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).send('This person is not in the phonebook.')
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = parseInt(req.params.id);

    persons = persons.filter(person => person.id !== id)

    res.status(204).send()
})

app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>
    `)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = 3001;
app.listen(PORT);
console.log(`Server listening on port ${PORT}`)