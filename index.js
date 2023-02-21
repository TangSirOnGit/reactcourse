require("dotenv").config();
const { request, response } = require("express");
const Person = require("./models/person");
const express = require("express");
const morgan = require("morgan");
const person = require("./models/person");

// morgan(':method :url :status :res[content-length] - :response-time ms')
morgan("default");

const app = express();
app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get("/", (request, response) => {
  response.send("<h1>This is a simple Phonebook app!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  // const id = Number(request.params.id);
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  const num = persons.length;
  const now = new Date();
  response.send(`<p>Phonebook has info for ${num} people</p>
    <p>${now}</p>
    `);
});

const PORT = process.env.PORT;
app.listen(PORT);

console.log(`Server running on port ${PORT}`);
