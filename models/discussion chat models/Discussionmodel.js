const mongoose = require("mongoose");


const DiscussionSchema = new mongoose.Schema({

    discusionname: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "course" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "teacher" },
    users: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: "student"
    }]
}, { timestamps: true }
);

const Discussion = mongoose.model("discussion", DiscussionSchema);

module.exports = Discussion;