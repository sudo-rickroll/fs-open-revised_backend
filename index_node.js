const http = require('http')

const phonebook = [
  {
    'id': '1',
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': '2',
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': '3',
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': '4',
    'name': 'Mary Poppendiecks',
    'number': '39-23-6423122'
  }
]

const app = http.createServer((request, response) => {
  //response.writeHead(200, {'Content-Type': 'application/json'});
  response.end(JSON.stringify(phonebook))
})

const PORT = 3001

app.listen(PORT)
console.log(`Server running on port ${PORT}`)