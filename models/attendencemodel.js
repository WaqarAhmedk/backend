const mongoose = require("mongoose");

const AttendenceSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    students: [
        {
            studentid: {
                type: mongoose.Schema.Types.ObjectId,
                require: true
            },
            status: {
                type: String,


            },
            

        }
    ],
}, {
    timestamps: true,
});

const AttendenceModel = mongoose.model("attendence", AttendenceSchema);
module.exports = AttendenceModel;