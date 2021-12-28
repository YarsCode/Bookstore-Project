const express = require('express');
const { findByIdAndUpdate } = require('../models/adminModel'); // לשאול את אריה
const adminAuth = require('../middleware/adminAuth');
const Admin = require('../models/adminModel');
// const adminAuth = require('../middleware/adminAuth');
const router = new express.Router();

router.post('/admins/new', async(req, res) => {
    const admin = new Admin(req.body)    
    try {
        await admin.save()
        const token = await admin.generateAuthToken();
        res.send({admin, token});
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: err.message,
        });
    }
})

router.get('/admins/get', async(req, res) => {
    const _id = req.query.id
    try {
        const admin = await Admin.findById(_id);
        if (!admin) {
            return res.status(404).send({
                status: 404,
                message: "Wrong ID",
            });
        }
        res.send(admin)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/admins/get-all', async(req, res) => {
    try {
        const admins = await Admin.find({})
        if(admins.length > 0) {
            res.send(admins)
        } else {
            res.send({
                message: "No admins",
            })
        }
    } catch (err) {
        res.status(400).send({
            message: err.message,
        })        
    }
});

router.patch('/admins/edit', adminAuth, async (req, res) => {
    if ((doesPropertiesMatch(req, res) !== true)) {
        return
    }
    try {
        for (let update in req.body) {
            req.admin[update] = req.body[update];
        }
        await req.admin.save();
        res.send(req.admin);
    } catch (err) {
        res.status(400).send ({
            status: 400,
            message: err.message
        })
    }
})

// router.patch('/users/edit-cart', auth, async (req, res) => {
//     for (let prop in req.body) {
//         if (prop !== "booksAtCart") {
//             return res.status(400).send({
//                 status:400,
//                 message: "Only changes in the 'booksAtCart' are allowed!"
//             })
//         }
//     }
//     try {
//         for (let change in req.body) {
//             req.user[change] = req.body[change]
//         }
        
//         await req.user.save()
//         res.send(req.user)    
//     } catch (err) {
//         res.status(400).send({
//             status: 400,
//             message: err.message
//         })
//     }    
// })

// router.get('/users/search', async(req, res) => {
//     if (doesPropertiesMatch(req, res) !== true)
//         return
//     try {
//         const users = await User.find(req.body)
//         if (users.length === 0) {
//             return res.status(404).send({
//                 status: 404,
//                 message: "User not found"
//             })
//         }
//         res.send(users);
//     } catch (err) {
//         res.status(500).send(err)        
//     }
// });

router.post('/admins/login', async(req, res) => {
    try {
        const admin = await Admin.findUserByEmailAndPassword(req.body.email, req.body.password);
        const token = await admin.generateAuthToken();
        res.send({admin, token})
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: err.message
        })
    }
});

router.post('/admins/logout', adminAuth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((tokenDoc) => tokenDoc.token !== req.token);
        await req.admin.save()
        res.send(req.admin);
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/admins/logout-all', adminAuth, async (req, res) => {
    try {
        req.admin.tokens = [];
        await req.admin.save()
        res.send({message:"Successfully logged out from all devices"});
    } catch (err) {
        res.status(500).send(err)
    }
})

router.delete('/admins/delete', adminAuth, async(req, res) => {
    const _id = req.query.id; // User to delete
    try {
        const admin = await Admin.findByIdAndDelete({_id})
        if (!admin) {
            return res.status(404).send({
                status: 404,
                message: "Wrong ID",
            });
        }
        res.send(admin);
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