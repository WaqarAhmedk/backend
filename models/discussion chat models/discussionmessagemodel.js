const mongoose = require("mongoose");


const DiscussionMessageSchema = new mongoose.Schema({

    sender: { type: mongoose.Schema.Types.ObjectId, refPath: "sender_type" },
    sender_type: { type: String, enum: ['student', 'teacher'] },
    message: { type: String },
    discusion: { type: mongoose.Schema.Types.ObjectId, ref: "discussion" }
}, { timestamps: true }
);

const DiscussionMessage = mongoose.model("discussionmessage", DiscussionMessageSchema);

module.exports = DiscussionMessage;