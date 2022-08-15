const mongoose = require("mongoose");


const TopicSchema = mongoose.Schema({
    courseid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
    },
    title: {
        type: String,
        required: true,
    },
    helpingmaterial: [
        {
            title: {
                type: String,
            },
            file: {
                type: String,

            },
            description: {
                type: String,

            }

        }
    ],
    assignments: [
        {
            course: {
                type: mongoose.Schema.Types.ObjectId,
                req: true,
            },
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,

            },
            filename: {
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

        }
    ],
    onlineclass: [
        {
            title: {
                type: String,
                required: true,
            },
            classtime: {
                type: Date,
                require: true,
            },
            classlink: {
                type: String,
                require: true,
            }
        }
    ],

    onlinequiz:
    {


    },
    createdat: {
        type: Date,
        default: Date.now
    }
});


const topicmodel = mongoose.model("topics", TopicSchema);
module.exports = topicmodel;