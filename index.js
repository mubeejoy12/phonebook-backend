const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());

const PORT = 3003;

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

// ✅ Create a custom Morgan token
morgan.token("body", (req) => {
    return req.method === "POST" ? JSON.stringify(req.body) : "";
  });
  
  // ✅ Use the custom format including :body
  app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

// POST new person
app.post("/api/persons", (req, res) => {
  const body = req.body;

  // 1. Check if name or number missing
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number missing" });
  }

  // 2. Check if name already exists
  const nameExists = persons.find((p) => p.name === body.name);
  if (nameExists) {
    return res.status(400).json({ error: "name must be unique" });
  }

  // 3. If all good, create new person
  const person = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

// default route
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

// all persons
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// info route
app.get("/info", (req, res) => {
  const count = persons.length;
  const time = new Date();
  res.send(`<p>Phonebook has info for ${count} people</p><p>${time}</p>`);
});

// single person by id
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: "person not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});
