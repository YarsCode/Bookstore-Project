const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
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
    booksAtCart: [
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
            },
            quantity: {
                type: Number
            },
            totalPrice: {
                type: Number
            },
        },
    ],
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

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
});

userSchema.statics.findUserByEmailAndPassword = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error("Unable to log in");
    }
    const isPassMatches = await bcrypt.compare(password, user.password);
    if (!isPassMatches) {
        throw new Error("Wrong Password");
    }
    return user;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign (
        {
        _id: user._id,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "6h",
        })
        user.tokens = user.tokens.concat({token});
        await user.save();
        return token;
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.token;
    return userObj;
}

// userSchema.virtual("books", {
//     ref: "Book",
//     localField: "_id",
//     foreignField: "user",
// })





const User = mongoose.model('User', userSchema);

module.exports = User;