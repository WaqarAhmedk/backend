const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const QuizSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "topic"
    },
    title:{
        type:String,
        require:true,
    },
    quiztime: {
        type: Date,
        require: true,
    },
    allowedtime: {
        type: String,
        require: true,

    },


    questions: [
        {
            questiontext: {
                type: String,
            },
            correctans: {
                type: String,

            },
            opt1val: {
                type: String
            },
            opt2val: {
                type: String
            },
            opt3val: {
                type: String
            },
            opt4val: {
                type: String
            },
        }
    ],

    students: [
        {
            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "student"
            },
            selectedans: [
                {
                    anstext: {
                        type: String
                    }


                }
            ]
        }
    ],


},
    {
        timestamps: true,
    });

const Quizmodel = mongoose.model("quiz", QuizSchema);
module.exports = Quizmodel;