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
    title: {
        type: String,
        require: true,
    },
    quiztime: {
        type: String,
        require: true,
    },
    allowedtime: {
        type: String,
        require: true,

    },
    endingtime:{
        type:String,
        require:true,
    },
    totalmarks: {
        type: Number,
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
            score: {
                type: String,
                require: true,
            },
            correct: {
                type: String,
                require: true,
            },
            attemptedquestion: {
                type: String,
                require: true
            }
        }
    ],


},
    {
        timestamps: true,
    });

const Quizmodel = mongoose.model("quiz", QuizSchema);
module.exports = Quizmodel;