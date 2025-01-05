const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Phonebook = require('./models/phonebook.js')

app.use(cors())
app.use(express.json());
app.use(express.static('dist'));

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendiecksj", 
      "number": "39-23-6423122"
    }
]

const getRandom = (num) => Math.floor(Math.random() * num).toString();
morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

app.get("/api/persons", (request, response) => {
    Phonebook.find({}).then(result => response.json(result));
})

app.get("/info", (request, response) => {
    Phonebook.find({}).then(result => response.send(`<p>Phonebook has info for ${result.length} people</p><br />    ${new Date()}`));    
})

app.get("/api/persons/:id", (request, response) => {
    Phonebook.find({_id: request.params.id.toString()}).then(result => {
        response.json(result);
    })
})

app.delete("/api/persons/:id", (request, response) => {
    const item = phonebook.find(contact => contact.id === request.params.id)
    if(item === null){
        response.status(404).send("Item not found");
    }
    phonebook = phonebook.filter(contact => contact.id !== request.params.id);
    response.status(200).send(item);
})

app.post("/api/persons", (request, response) => {
    let contact = request.body;
    if((contact.name ?? "") === "" || (contact.number ?? "") === ""){
        response.status(400).json({
            error: "Name or number cannot be empty"
        })
    }

    if(phonebook.find(record => record.name === contact.name)){
        response.status(400).json({
            error: "Name already exists"
        })
    }
    contact = {id: getRandom(9999999999999999), ...contact}
    phonebook = [...phonebook, contact]
    response.status(200).json(contact);
})

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Application started on ${PORT}`);
})