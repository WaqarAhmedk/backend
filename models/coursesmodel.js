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

const coursemodel = mongoose.model("course", CourseSchema);
module.exports = coursemodel;