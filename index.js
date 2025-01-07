require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Phonebook = require('./models/phonebook.js')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

const unknownEndpointHandler = (request, response, next) => next({
  message: 'Unknown Endpoint'
})

const errorHandler = (error, request, response, next) => {

  response.status(500).send({
    error: error.message
  })

}

app.get('/api/persons', (request, response, next) => {
  Phonebook.find({}).then(result => response.json(result)).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Phonebook.find({}).then(result => response.send(`<p>Phonebook has info for ${result.length} people</p><br />    ${new Date()}`)).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id.toString()).then(result => {
    response.json(result)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then(result => {
      if(result === null)
      {
        next({
          message: 'Item not found, may have been deleted already'
        })
      }
      else{
        response.status(200).json(result)
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const contact = new Phonebook(request.body)

  Phonebook.find({ name: contact.name }).then(result => {
    if(result.length > 0){
      response.status(400).json({
        message: 'Name already exists'
      })
    }else{
      contact.save().then(result => {
        response.status(200).json(result)
      }).catch(error => next(error))
    }

  }).catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  let contact = request.body


  Phonebook.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(result => response.json(result))
    .catch(error => next(error))
})

app.use(unknownEndpointHandler)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Application started on ${PORT}`)
})