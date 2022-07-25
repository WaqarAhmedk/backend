const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique:true,

    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default:"student"
    },
    createdat: {
        type: Date,
        default: Date.now
    }
});

const student=mongoose.model("student", UserSchema);

module.exports = student;