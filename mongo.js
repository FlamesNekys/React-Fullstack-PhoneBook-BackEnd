const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://yodacj21:${password}@test-cluster.qfq4izm.mongodb.net/phoneBookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)



if (process.argv.length === 5) {
    const person = new Person({
        "name": process.argv[3],
        "number": process.argv[4]
    })
    person.save().then(res => {
        console.log(`added ${res.name} number ${res.number} to the phonebook`)
        mongoose.connection.close()
})}

if (process.argv.length === 3) Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
