const mongoose = require("mongoose");

const TeacherUserSchema = new mongoose.Schema({
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
        unique: true,

    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "teacher",
    },
    createdat: {
        type: Date,
        default: Date.now
    }
});

const teacher = mongoose.model("teacher", TeacherUserSchema);

module.exports = teacher;