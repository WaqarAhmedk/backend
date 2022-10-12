const express = require("express");
const getStudent = require("../../middleware/getstudent");
const getTeacher = require("../../middleware/getteacher");
const Quizmodel = require("../../models/onlinequizmodel");
const topicmodel = require("../../models/Topicsmodel");
const router = express.Router();



router.post("/create-quiz/:topicid", getTeacher, async (req, res) => {
  const topicid = req.params.topicid;

  const { courseid, title, quiztime, allowedtime, finalquestions } = req.body;

  const marks = finalquestions.length * 2;



  try {
    const createdquiz = await Quizmodel.create({
      course: courseid,
      topic: topicid,
      title: title,
      totalmarks: marks,
      quiztime: quiztime,
      allowedtime: allowedtime,
      questions: finalquestions
    });

    const ans = await topicmodel.findByIdAndUpdate(topicid, {
      $push: {
        quiz: {
          quizref: createdquiz._id
        }
      }
    });

    res.send({
      success: true,
      message: "Quiz Created for the given topic",
    });
  } catch (error) {

    res.send("Some internal Error")
    console.log("error in creating quiz" + err);
  }


});






router.get("/check-quiztime/:quizid", async (req, res) => {
  const quizid = req.params.quizid;
  const time = new Date();
  const data = await Quizmodel.findById(quizid);
  console.log(data.quiztime.toLocaleString());

  if (time.toLocaleString() >= data.quiztime.toLocaleString()) {


    res.send({
      success: true,
      allowed: true,
      time: time.toLocaleString(),
    });
  }
  else {
    res.send({
      success: true,
      allowed: false,
      message: "Your Quiz is not Available at this time it will start at " + data.quiztime.toLocaleString(),
    });
  }

});




router.get("/get-quiz-details/:quizid", async (req, res) => {
  const quizid = req.params.quizid;
  const time = new Date();
  const data = await Quizmodel.findById(quizid);
  console.log(data);
  if (time.toLocaleString() >= data.quiztime.toLocaleString()) {
    res.send({
      success: true,
      allowed: true,
      details: {
        title: data.title,
        totalquestions: data.questions.length,
        allowedtime: data.allowedtime,
        totalmarks: data.totalmarks


      }



    });

  }

  else {
    res.send({
      success: false,
      allowed: false,
      message: "Your Quiz is not Available at this time it will start at " + data.quiztime.toLocaleString(),
    });
  }


});


router.get("/get-quiz-alldetails/:quizid", async (req, res) => {
  const quizid = req.params.quizid;
  const time = new Date();
  const data = await Quizmodel.findById(quizid);
  console.log(data);
  if (time.toLocaleString() >= data.quiztime.toLocaleString()) {
    res.send({
      success: true,
      details: data


    });

  }





});


router.post("/submit-quiz/:quizid", getStudent, async (req, res) => {
  const quizid = req.params.quizid;
  const studentid = req.user.id;

  const { score, correct, wrong, attemptedquestions } = req.body;


  try {
    const a = await Quizmodel.findByIdAndUpdate(quizid, {
      $push: {

        students: {
          student: studentid,
          score: score,
          correct: correct,
          wrong: wrong,
          attemptedquestions: attemptedquestions
        }
      }
    });
    console.log(a);
  } catch (error) {

  }





});


router.get("/get-your-quiz-result/:quizid", getStudent, async (req, res) => {
  const quizid = req.params.quizid;
  const studentid = req.user.id;

  try {


    const result = await Quizmodel.findOne({ _id: quizid, "students.student": studentid });
    console.log(result);
  }


  catch (error) {

  }





});


module.exports = router;