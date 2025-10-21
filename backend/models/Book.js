// models/Book.js
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true
    },
    copies: {
        type: Number,
        required: true,
        default: 1
    },
    totalCopies: {
        type: Number,
        required: false,
        default: 1
    },
    cover: {
        type: String,
        required: false,
        trim: true
    },
    isbn: {
        type: String,
        required: false,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    }
});

module.exports = mongoose.model('Book', BookSchema);
