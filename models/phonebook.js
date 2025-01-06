require('dotenv').config()
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI

mongoose.connect(url);

const schema = new mongoose.Schema({
    name: String,
    number: String
})

schema.set('toJSON', {
    transform: (document, renderedObject) => {
        renderedObject.id = renderedObject._id.toString();
        delete renderedObject._id;
        delete renderedObject.__v;
    }
})

module.exports = mongoose.model('Phonebook', schema);


