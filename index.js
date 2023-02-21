const { request, response } = require("express");
const express = require("express");
const morgan = require('morgan')

// morgan(':method :url :status :res[content-length] - :response-time ms')
morgan('default')

const app = express();
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// app.use(requestLogger)
// app.use(morgan)


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
const personExist = (name, number) =>{
  // console.log('personExist', name, number)
  // console.log('personExist', persons)

  if(persons.findIndex(person =>{
    // console.log('personExist find', person.name, person.number)
    return person.name === name || person.number === number
  }) >=0){
    return true
  } else{
    return false
  }
}
app.post('/api/persons', (request, response) => {

  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  if(personExist(body.name, body.number)){
    if (!body.name || !body.bumber) {
      return response.status(400).json({ 
        error: 'name and number must be unique' 
      })
    }
  }

  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id)) 
    : 0

  const person = request.body
  person.id = maxId + 1

  persons = persons.concat(person)

  console.log(person)
  response.json(person)
})

app.get("/", (request, response) => {
  response.send("<h1>This is a simple Phonebook app!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person=> person.id === id)
    console.log('get single person info,', id, 'result:',person)
    if(person){
        response.json(person);
    }else{
        response.status(404).end();
    }
    
  });

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end();
})

  

app.get("/info", (request, response) => {
  const num = persons.length;
  const now = new Date();
  response.send(`<p>Phonebook has info for ${num} people</p>
    <p>${now}</p>
    `);
});

const PORT = process.env.PORT || 3001
app.listen(PORT);

console.log(`Server running on port ${PORT}`);
