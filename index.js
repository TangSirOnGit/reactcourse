require("dotenv").config();
const { request, response } = require("express");
const Person = require("./models/person");
const express = require("express");
const morgan = require("morgan");

// morgan(':method :url :status :res[content-length] - :response-time ms')
morgan("default");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error("errorHandler", error);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error);
};

const app = express();
app.use(express.json());
app.use(requestLogger);

app.post("/api/persons", (request, response,next) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  })
  .catch(error=>next(error));
});

app.get("/", (request, response) => {
  response.send("<h1>This is a simple Phonebook app!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
  // const id = Number(request.params.id);
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log('get, error catch')
      console.log(error)
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response,next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
});

app.get("/info", (request, response) => {
  const num = persons.length;
  const now = new Date();
  response.send(`<p>Phonebook has info for ${num} people</p>
    <p>${now}</p>
    `);
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);

console.log(`Server running on port ${PORT}`);
