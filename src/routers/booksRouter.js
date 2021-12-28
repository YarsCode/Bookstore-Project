const express = require('express');
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const Book = require("../models/bookModel")
const router = new express.Router();

router.post('/books/new', adminAuth, async (req, res) => {
    const book = new Book({
        ...req.body,
        user: req.admin._id
    });
    try {
        await book.save();
        res.send(book);
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/books/get', async(req, res) => {
    const _id = req.query.id;    
    try {
        const book = await Book.findOne({_id});
        if (!book) {
            return res.status(404).send({
                status: 404,
                message: "Book is not found"
            });
        }
        res.send(book);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.get('/books/get-all', async(req, res) => {
    // const match = {};
    // const options = {};
    // if (req.query.limit) {
    //     options.limit = parseInt(req.query.limit)
    // }
    // if (req.query.skip) {
    //     options.skip = parseInt(req.query.skip)
    // }
    // if (req.query.sortDate) {
    //     options.sort = {};
    //     options.sort.createdAt = req.query.sortDate === "desc" ? -1 : 1;
    // }
    try {
        // await req.user.populate({
        //     path: "books",
        //     match,
        //     options
        // })
        // .execPopulate();
        const books = await Book.find({});
        res.send(books);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.delete('/books/delete', adminAuth, async(req, res) => {
    const _id = req.query.id;

    try {
        const book = await Book.findOneAndDelete({_id});
        if (!book) {
            return res.status(404).send({
                status: 404,
                message: "No such book",
            });
        }
        res.send(book);
    } catch (err) {
        res.status(500).send("Wrong ID");
    }   
})

router.patch('/books/edit', adminAuth, async (req, res) => {
    const allowedUpdates = ["name", "author", "imageURL", "genre", "summary", "price"]
    for (let update in req.body) {
        if(!allowedUpdates.includes(update)) {
            return res.status(400).send({
                status: 400,
                message: "Invalid update: " + update,
            })
        }
    }    
    const _id = req.query.id;

    try {
        const book = await Book.findOneAndUpdate({_id}, req.body, {
            new: true,
            runValidators: true
        });
        if (!book) {
            return res.status(404).send({
                status: 404,
                message: "No book",
            });
        }
        res.send(book);
    } catch (err) {
        res.status(500).send(err)
    }
})




module.exports = router;