const mongoose = require("mongoose");

const UploadAssignmentSchema = new mongoose.Schema({
    courseid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
    },
    studentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student"
    },
    topicid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "topic"
    },
    assignmentid: {
        type: mongoose.Schema.Types.ObjectId
    },
    filename: {
        type: String,
        required: true,
    },
    uploadtime: {
        type: String,
        default: Date.now
    },
    grade: {
        type: String,
        default:"Not Marked"

    }

})

const uploadassignmentmodel = mongoose.model("uploadedassignment", UploadAssignmentSchema);

module.exports = uploadassignmentmodel;