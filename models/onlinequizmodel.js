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
    starttime: {
        type: Date,
        require:true,
    },
    endtime: {
        type: Date,
        require: true,

    },
    qusetions: [
        {
            qustiontext: {
                type: String,
            },
            correctans: {
                type: String,

            },
            ansoptions: [
                {
                    anstext: {
                        type: String
                    }
                }
            ]
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
    timestamps:true,
});

const Quizmodel=mongoose.model("quiz" ,QuizSchema);
module.exports=Quizmodel;