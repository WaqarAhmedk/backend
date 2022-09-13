const express = require("express");
const Quizmodel = require("../../models/onlinequizmodel");
const router = express.Router();



router.post("/create/:topicid",async (req,res)=>{


    const topic=req.params.topicid;
    // const questions=req.body.questions;

    const {course ,starttime,endtime}=req.body;
    const questions=req.body.questions;

  try {
    
    const createdquiz=await  Quizmodel.create({
      course:course,
      topic:topic,
      starttime:starttime,
    });


    questions.map(async(item )=> {
      
       await Quizmodel.findByIdAndUpdate(createdquiz._id,{
     $push:{
      "questions.$.questiontext":item.questiontext

     }
     })
    
    
    })

    
  res.send(o)
  } catch (error) {
    
  }


});

module.exports = router;