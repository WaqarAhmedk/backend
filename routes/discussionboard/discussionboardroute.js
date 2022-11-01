const express = require('express');
const { get } = require('mongoose');
const getStudent = require('../../middleware/getstudent');
const getTeacher = require('../../middleware/getteacher');
const DiscussionMessage = require('../../models/discussion chat models/discussionmessagemodel');
const router = express.Router();
const jwt = require('jsonwebtoken')


async function CreateMessage(messagedata) {

    let jwt_secret = "";
    if (messagedata.role === "student") {
        jwt_secret = process.env.STUDENT_JWT_SECRET;

    } else if (messagedata.role === "teacher") {
        jwt_secret = process.env.TEACHER_JWT_SECRET;

    }

    try {


        const token = messagedata.sender;

        if (!token) {
            return ({success:false ,messsage:"Please provide a  token"});
        }
        const data = jwt.verify(token, jwt_secret);
        const user = data.user;

        var result;


        await DiscussionMessage.create({
            discusion: messagedata.courseid,
            message: messagedata.message,
            sender: user.id,
            sender_type: messagedata.role
        }).then(async (value) => {
             result = await value.populate("sender", 'firstname email avatar');


        });
        return result;
    } catch (error) {
        console.error(error);
        return ("Please provide a valid token to authnticate");
    }

    // const { discusion, message, sender } = messagedata;
    // console.log(messagedata);




    // const createdmessage = DiscussionMessage.create({
    //     discusion: discusion,
    //     message: message,
    //     sender: sender,
    //     sender_type: "student"
    // });
}

async function Loadmessages(discussion) {

    console.log(discussion);
    try {

        const allmessages = await DiscussionMessage.find({
            discusion: discussion
        }).populate("sender", 'firstname email avatar')
        return allmessages;



    } catch (error) {
        console.error(error);
        return ("some erro");
    }


}






module.exports = { CreateMessage, Loadmessages }