const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        trim: true
    },
    lastName: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('Invalid Email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{0,}$/
            if(!passRegex.test(value))
                throw new Error('Password must contain lowercase and uppercase characters and numbers.');
        }
    },
    // isAdmin: {
    //     type: Boolean,
    //     required: true
    // },
    tokens: [
        {
            token: {
                type: String,
                required: true
            },
        },
    ],
}, {
    timestamps: true
});

adminSchema.pre('save', async function (next) {
    const admin = this;
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }
    next();
});

adminSchema.statics.findUserByEmailAndPassword = async (email, password) => {
    const admin = await Admin.findOne({email});
    if (!admin) {
        throw new Error("Unable to log in");
    }
    const isPassMatches = await bcrypt.compare(password, admin.password);
    if (!isPassMatches) {
        throw new Error("Wrong Password");
    }
    return admin;
}

adminSchema.methods.generateAuthToken = async function () {
    const admin = this;
    const token = jwt.sign (
        {
        _id: admin._id,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "6h",
        })
        admin.tokens = admin.tokens.concat({token});
        await admin.save();
        return token;
};

adminSchema.methods.toJSON = function () {
    const admin = this;
    const adminObj = admin.toObject();

    delete adminObj.password;
    delete adminObj.token;
    return adminObj;
}

// adminSchema.virtual("books", {
//     ref: "Book",
//     localField: "_id",
//     foreignField: "user",
// })

// adminSchema.pre('remove', async function (next) {
//     const admin = this;
//     await Task.deleteMany({user: user._id});
//     next();
// })





const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;