const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

const url = `mongodb+srv://phonebook-app:${password}@react-phonebook.7dyfoxa.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  id: 1,
  name: `${name}`,
  number: `${phoneNumber}`,
});

if(name){
    person.save().then((result) => {
        console.log(`added ${name} ${phoneNumber} to phonebook`);
        mongoose.connection.close();
      });
}else{
    Person.find({}).then((result) => {
        console.log('phonebook:')
        result.forEach((person) => {
          console.log(person.name, person.number);
        });
        mongoose.connection.close();
      });
}



