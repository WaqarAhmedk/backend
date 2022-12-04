const { default: mongoose } = require("mongoose");

const StudentNotificationSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"

    },

    time: {
        type: String,
        require: true
    }
})

const StudentNotificationModel = mongoose.model("studentnotification", StudentNotificationSchema);
module.exports = StudentNotificationModel;