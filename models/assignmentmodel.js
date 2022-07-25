const mongoose = require("mongoose");


const AssignmentSchema = mongoose.Schema({
    topicid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "topic",
        required: true,

    },
    courseid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,

    },
    filepath: {
        type: String,
        required: true,
    }
    ,
    createdat: {
        type: Date,
        default: Date.now,
    },
    submissiondate: {
        type: Date,
        required: true,
    }
});

const assignmentmodel=mongoose.model("assignment",AssignmentSchema);
module.exports=assignmentmodel;