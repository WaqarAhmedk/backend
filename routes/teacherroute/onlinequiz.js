const express = require("express");
const Quizmodel = require("../../models/onlinequizmodel");
const router = express.Router();



router.post("/create/:topicid",async (req,res)=>{


    const topic=req.params.topicid;
    // const questions=req.body.questions;

    const {courseid ,starttime,endtime,questions}=req.body;

  const o=await  Quizmodel.create({
    courseid:courseid,
    topic:topic,
    questions:questions

  });





   
res.send(o)


});

module.exports = router;