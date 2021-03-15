const User = require('../models/userModel');

const adminAuth = async (req, res, next) => {
    try {
        if (!req.user.isAdmin)
            throw new Error ("Only admins are allowed to do that");
        next();
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: err.message
        })
    }
}


module.exports = adminAuth;