const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique:true,

    },
    courses:[
        {
            courseid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "course",
            },
            coursename:{
                type:String,
                required:true
            },
            teacherid: {
                type: mongoose.Types.ObjectId,
                ref: "teacher",
            },
            createdat: {
                type: Date,
                default: Date.now
            }
        }
    ],
    password: {
        type: String,
        required: true,
    },
    avatar:{
        type:String,
        default:"avatar.jpg"
    },
    role: {
        type: String,
        required: true,
        default:"student"
    },
    createdat: {
        type: Date,
        default: Date.now
    }
});

const studentmodel=mongoose.model("student", UserSchema);

module.exports = studentmodel;