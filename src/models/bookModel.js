const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    imageURL: {
        type: String,
        trim: true,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
    },
    genre: {
        type: String,
        required: true,
        trim: true,
    },
    summary: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true,
})

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;