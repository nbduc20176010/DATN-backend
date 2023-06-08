const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
    username: {
        require: true,
        type: String
    },
    password: {
        require: true,
        type: String
    },
    role: {
        require: true,
        type: String,
        enum: ['admin', 'teacher', 'regular']
    },
})

module.exports = mongoose.model('Account', accountSchema)