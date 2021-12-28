const express = require('express');
const { findByIdAndUpdate } = require('../models/userModel'); // לשאול את אריה
const auth = require('../middleware/auth');
const User = require('../models/userModel');
const Book = require("../models/bookModel")
// const adminAuth = require('../middleware/adminAuth');
const router = new express.Router();

router.post('/users/new', async(req, res) => {
    const user = new User(req.body)    
    try {
        await user.save()
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: err.message,
        });
    }
})

router.get('/users/get', async(req, res) => {
    const _id = req.query.id
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send({
                status: 404,
                message: "Wrong ID",
            });
        }
        res.send(user)
        // User.findOne({_id}).populate("booksAtCart.book").exec((error, user) => {
        //     res.send(user)
        // })
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/users/get-all', async(req, res) => {
    try {
        const users = await User.find({})
        if(users.length > 0) {
            res.send(users)
        } else {
            res.send({
                message: "No users",
            })
        }
    } catch (err) {
        res.status(400).send({
            message: err.message,
        })        
    }
});

router.patch('/users/edit', auth, async (req, res) => {
    // for (let prop in req.body) {
    //     if (prop === "isAdmin") {
    //         return res.status(400).send({
    //             status: 400,
    //             message: `Unable to change the isAdmin property`
    //         })
    //     }            
    // }
    if ((doesPropertiesMatch(req, res) !== true)) {
        return
    }
    try {
        for (let update in req.body) {
            req.user[update] = req.body[update];
        }
        await req.user.save();
        res.send(req.user);
    } catch (err) {
        res.status(400).send ({
            status: 400,
            message: err.message
        })
    }
})

router.patch('/users/edit-cart', auth, async (req, res) => {
    for (let prop in req.body) {
        if (prop !== "booksAtCart") {
            return res.status(400).send({
                status:400,
                message: "Only changes in the 'booksAtCart' are allowed!"
            })
        }
    }
    try {
        // User.findOne(req.user).populate("booksAtCart.book").exec((error, user) => {
        //     res.send(user)
        // })
        for (let change in req.body) {
            req.user[change] = req.body[change]
        }
        await req.user.save()
        res.send(req.user)    
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: err.message
        })
    }    
})

router.get('/users/get-cart', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (user.booksAtCart.length > 0) {
            User.findOne(req.user).populate("booksAtCart.book").exec((error, books) => {
                res.send(books.booksAtCart)
            })
        } else {
            res.send({
                message: "No items in cart",
            })
        }
    } catch (err) {
        res.status(400).send({
            message: err.message,
        })        
    }
});

router.get('/users/search', async(req, res) => {
    if (doesPropertiesMatch(req, res) !== true)
        return
    try {
        const users = await User.find(req.body)
        if (users.length === 0) {
            return res.status(404).send({
                status: 404,
                message: "User not found"
            })
        }
        res.send(users);
    } catch (err) {
        res.status(500).send(err)        
    }
});

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findUserByEmailAndPassword(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token})
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: err.message
        })
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenDoc) => tokenDoc.token !== req.token);
        await req.user.save()
        res.send(req.user);
    } catch (err) {
        res.status(500).send(err)
    }
})
// router.post('/users/expired-tokens-logout', async (req, res) => {
//     try {
//         req.user.tokens = [];
//         await req.user.save()
//         res.send(req.user);
//     } catch (err) {
//         res.status(500).send(err)
//     }
// })

router.post('/users/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save()
        res.send({message:"Successfully logged out from all devices"});
    } catch (err) {
        res.status(500).send(err)
    }
})

router.delete('/users/delete', auth, async(req, res) => {
    const _id = req.query.id; // User to delete
    try {
        // await req.user.remove();
        const user = await User.findByIdAndDelete({_id})
        if (!user) {
            return res.status(404).send({
                status: 404,
                message: "Wrong ID",
            });
        }
        res.send(user);
    } catch (err) {
        res.status(500).send(err)        
    }
});

const doesPropertiesMatch = (req, res) => {
    const allowedProperties = ["firstName", "lastName", "email", "password"]
    for (let prop in req.body) {
        if(!allowedProperties.includes(prop)) {
            return res.status(404).send({
                    status: 404,
                    message: `Unable to find ${prop}`
                })
        }
    }
    return true;
}

module.exports = router;