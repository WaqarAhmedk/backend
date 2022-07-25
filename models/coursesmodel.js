const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher",
    },
    coursename: {
        type: String,
        required: true,
    },
    createdat: {
        type: Date,
        default: Date.now
    }
});

const course = mongoose.model("course", CourseSchema);
module.exports = course;