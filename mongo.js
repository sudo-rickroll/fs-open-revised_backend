const mongoose = require('mongoose');
if(process.argv.length < 3){
    console.log("Enter details in arguments");
    process.exit(1);
}
const password = encodeURIComponent(process.argv[2]);

const url = `mongodb+srv://fsopen:${password}@fsopen-revised.fzfch.mongodb.net/phonebook?retryWrites=true&w=majority&appName=FSOpen-Revised`;
mongoose.set('strictQuery',false)

mongoose.connect(url);

const schema = new mongoose.Schema({
    name: String,
    number: String
});

const Phonebook = mongoose.model('Phonebook', schema);

if(process.argv.length > 3){
    const phonebook = new Phonebook({
        name: process.argv[3],
        number: process.argv[4]
    })
    phonebook.save().then(result => {
        console.log(`added ${phonebook.name} number ${phonebook.number} to phonebook`)
        mongoose.connection.close();
    });
}

else if (process.argv.length === 3){
    Phonebook.find({}).then(result => {
        console.log("phonebook: ")
        result.forEach(item => {
            console.log(`${item.name} ${item.number}`)
        })
        mongoose.connection.close();
    })
}



