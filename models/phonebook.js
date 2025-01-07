require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs')

const validationConstraints = {
  numberRegex: /^\d{2,3}-\d{6,}/,
  message: input => `Phone number ${input} does not meet the format specifications`,
  validator: input => validationConstraints.numberRegex.test(input)
}

const url = process.env.MONGODB_URI || fs.readFileSync('/etc/secrets/MONGODB_URI', 'utf8').trim()

mongoose.connect(url)

const schema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate:{
      validator: input => validationConstraints.validator(input),
      message: input => validationConstraints.message(input.value)
    }
  }
})

schema.set('toJSON', {
  transform: (document, renderedObject) => {
    renderedObject.id = renderedObject._id.toString()
    delete renderedObject._id
    delete renderedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', schema)


