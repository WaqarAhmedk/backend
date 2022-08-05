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
    helpingmaterial:[
        {
            type:String,

        }
    ],
    assignments:[
        {

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
            
        }
    ],
    createdat: {
        type: Date,
        default: Date.now
    }
});


const topicmodel=mongoose.model("topics",TopicSchema);
module.exports=topicmodel;