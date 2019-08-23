const mongoose = require('mongoose')

let songSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number,
        default: () => Date.now()
    }
    
})

module.exports = mongoose.model('song', songSchema)