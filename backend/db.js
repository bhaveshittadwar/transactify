const mongoose = require('mongoose')
const userName = process.env.mongoUser
const password = process.env.mongoPass

mongoose.connect(`mongodb+srv://${userName}:${password}@cluster0.thjsnlm.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        console.log('MongoDB Connected Successfully');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {User}
