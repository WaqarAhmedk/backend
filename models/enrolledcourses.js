const mongoose = require("mongoose");


const EnrolledcourseSchema = mongoose.Schema({
    courseid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
    },
    studentid: {
        type: mongoose.Types.ObjectId,
        ref: "student",
    },
    teacherid: {
        type: mongoose.Types.ObjectId,
        ref: "teacher",
    },
    createdat: {
        type: Date,
        default: Date.now
    }
});

const enrolledmodel = mongoose.model("enrolledcourse", EnrolledcourseSchema);
module.exports = enrolledmodel;