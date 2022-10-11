const express = require("express");
const getTeacher = require("../../middleware/getteacher");
const Quizmodel = require("../../models/onlinequizmodel");
const topicmodel = require("../../models/Topicsmodel");
const router = express.Router();



router.post("/create-quiz/:topicid", getTeacher, async (req, res) => {
  const topicid = req.params.topicid;

  const { courseid, title, quiztime, allowedtime, finalquestions } = req.body;


  try {
    const createdquiz = await Quizmodel.create({
      course: courseid,
      topic: topicid,
      title: title,
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
  console.log(time.toLocaleString());
  console.log(quizid);
  const data = await Quizmodel.findById(quizid);
  console.log(data.quiztime.toLocaleString());

  if (time.toLocaleString() >= data.quiztime.toLocaleString()) {


    res.send({
      success: true,
      time: time.toLocaleString(),
    });
  }
  else {
    res.send({
      success: true,
      message: "Your Quiz is not Available at this time it will start at" + data.quiztime.toLocaleString(),
    });
  }

});





module.exports = router;