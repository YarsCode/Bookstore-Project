const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    author: {
        type: String,
        trim: true,
    },
    imageURL: {
        type: String,
        trim: true,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
    },
    genre: {
        type: String,
        trim: true,
    },
    summary: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        min: 0
    }
}, {
    timestamps: true,
})

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;