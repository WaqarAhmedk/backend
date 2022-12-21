const express = require("express");
const getStudent = require("../../../middleware/getstudent");
const getTeacher = require("../../../middleware/getteacher");
const Quizmodel = require("../../../models/onlinequizmodel");
const topicmodel = require("../../../models/Topicsmodel");
const CourseModel = require("../../../models/coursesmodel");
const studentmodel = require("../../../models/studentmodel");
const StudentNotificationModel = require("../../../models/StudentNotificationmodel");
const coursemodel = require("../../../models/coursesmodel");
const router = express.Router();
const moment = require("moment")



router.post("/create-quiz/:topicid", getTeacher, async (req, res) => {
  const topicid = req.params.topicid;

  const { courseid, title, convertedtime, allowedtime, finalquestions, endingtime } = req.body;

  const marks = finalquestions.length * 2;


  console.log(req.body);

  try {
    const createdquiz = await Quizmodel.create({
      course: courseid,
      topic: topicid,
      title: title,
      totalmarks: marks,
      endingtime: endingtime,
      quiztime: convertedtime,
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
    const d = await coursemodel.findById(courseid);
    const timenow = moment();
    await StudentNotificationModel.create({
      text: `New Quiz ${title} Created For Course ${d.coursename} and Topic ${ans.title} Quiz will be Available at ${convertedtime}`,
      course: courseid,
      time: timenow
    });
  } catch (error) {

    res.send("Some internal Error")
    console.log("error in creating quiz" + err);
  }


});

router.post("/update-quiz/:quizid", getTeacher,
  async (req, res) => {


    const quizid = req.params.quizid;

    const { title, allowedtime, quiztime ,endingtime} = req.body;

    try {

      const data = await Quizmodel.findByIdAndUpdate(quizid, {
        title: title,
        allowedtime: allowedtime,
        quiztime: quiztime,
        endingtime:endingtime

      }).populate('course');
      console.log(data);

      res.send({
        success: true,
        msg: "Quiz Deatils Updated Successfully",
      })

      const timenow = moment();
      await StudentNotificationModel.create({
        text: ` Quiz ${data.title} for Course ${data.course.coursename} has somechanges from your Teacher  Quiz will be Available at ${quiztime}`,
        course: data.course._id,
        time: timenow
      });
    }

    catch (error) {
      console.log("Update assignment error  " + error);
    }
  }
);

router.delete("/delete-quiz/:topicid/:quizid", getTeacher,
  async (req, res) => {


    const topicid = req.params.topicid;
    const quizid = req.params.quizid;



    try {

      const a = await topicmodel.findByIdAndUpdate(topicid, { $pull: { quiz: { _id: quizid } } });
      console.log(a);
      res.send({
        success: true,
        msg: "Quiz Deleted Successfully",
      })
    } catch (error) {
      console.log("Delete Assignment Error  " + error);
    }
  }

);

router.get("/check-quiztime/:quizid", getStudent, async (req, res) => {
  const quizid = req.params.quizid;
  const studentid = req.user.id;


  const data = await Quizmodel.findById(quizid);

  const timenow = new Date();
  const quizstarttime = new Date(data.quiztime);




 



  if (timenow - quizstarttime < 0) {


    res.send({
      success: true,
      allowed: false,
      message: "Your Quiz is not Available at this time it will start at " + data.quiztime.toLocaleString(),
    });


  }

  else {



    const available = new Date(data.endingtime);

    if (timenow - available < 0) {
      const result = await Quizmodel.findOne({ _id: quizid, "students.student": studentid });

      if (result) {
        res.send({
          success: true,
          allowed: false,
          message: "You  have Already attempted this Quiz You are allowed only once"
        });
      } else {
        res.send({
          success: true,
          allowed: true,
          time: timenow.toLocaleString(),
        });
      }
    }
    else {
      res.send({
        success: true,
        allowed: false,
        message: "Your Quiz is expired at " + data.endingtime.toLocaleString(),
      });

    }








  }

});




router.get("/get-quiz-details/:quizid", getStudent, async (req, res) => {
  const quizid = req.params.quizid;
  const studentid = req.user.id
  const data = await Quizmodel.findById(quizid);

  const timenow = new Date();
  const quizstarttime = new Date(data.quiztime);

  if (timenow - quizstarttime < 0) {


    res.send({
      success: false,
      allowed: false,
      message: "Your Quiz is not Available at this time it will start at " + data.quiztime.toLocaleString(),
    });




  }

  else {

    const available = new Date(data.endingtime);
    // console.log(ava);
    if (timenow - available < 0) {
      const result = await Quizmodel.findOne({ _id: quizid, "students.student": studentid });

      if (result) {
        res.send({
          success: false,
          message: "You  have Already attempted this Quiz You are allowed only Once "
        });

      }
      else {


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

    }
    else {
      res.send({
        success: false,
        allowed: false,
        message: "Your Quiz is not Available at this time it expired on " + data.endingtime.toLocaleString(),
      });
    }
  }

});


router.get("/get-quiz-alldetails/:quizid", async (req, res) => {
  const quizid = req.params.quizid;
  const time = new Date();
  const data = await Quizmodel.findById(quizid);

  res.send({
    success: true,
    details: data


  });







});


router.post("/submit-quiz/:quizid", getStudent, async (req, res) => {
  const quizid = req.params.quizid;
  const studentid = req.user.id;

  const { score, correct, attemptedquestions } = req.body;


  try {
    const result = await Quizmodel.findOne({ _id: quizid, "students.student": studentid });

    if (result) {
      res.send({
        success: false,
        message: "You  have Already attempted this Quiz You are allowed only Once "
      });
    }
    else {
      const a = await Quizmodel.findByIdAndUpdate(quizid, {
        $push: {

          students: {
            student: studentid,
            score: score,
            correct: correct,
            attemptedquestions: attemptedquestions,
          }
        }
      });


      res.send({
        success: true,
        message: "Your Quiz Result submitted Successfully"
      });
    }


  }
  catch (error) {
    console.log("error in  Quiz submit" + error);
  }





});


router.get("/get-your-quiz-result/:quizid", getStudent, async (req, res) => {
  const quizid = req.params.quizid;
  const studentid = req.user.id;

  try {


    const result = await Quizmodel.findOne({ _id: quizid, "students.student": studentid });
    if (result) {
      res.send({
        success: true,
        details: result
      });
    }
    console.log(result);
  }


  catch (error) {
    console.log("error in getting quiz result by student" + error);

  }





});


router.get("/get-all-students-quiz-result/:courseid/:quizid", async (req, res) => {
  const quizid = req.params.quizid;
  const courseid = req.params.courseid;

  let notattended = [];
  let attended = [];
  let allstudents = [];


  try {





    const findstudents = await studentmodel.find({ 'courses.course': courseid });

    for (var i = 0; i <= findstudents.length - 1; i++) {
      allstudents.push(findstudents[i]._id);
    }
    const attendedstudents = await Quizmodel.findById(quizid);
    // console.log(attendedstudents.students);


    for (var i = 0; i < attendedstudents.students.length; i++) {

      attended.push(attendedstudents.students[i].student)
    }



    const notattended = [];
    for (var i = 0; i < allstudents.length; i++) {

      for (var j = 0; j < attended.length; j++) {
        allstudents[j]


        if (allstudents[i].toString() === attended[j].toString()) {
          // ALready implented logic
        }
        else {
          notattended.push(allstudents[i])
        }
      }
    }






    //students attende quiz
    const result = await Quizmodel.findById(quizid).populate({
      path: "students.student",
      select: "-password"
    });
    const remainingStudents = await studentmodel.find().select('-password -courses').where('_id').in(notattended).exec();







    res.send({
      success: true,
      details: result,
      notattended: remainingStudents
    });








  }




  catch (error) {
    console.log("error in getting quiz result by student" + error);

  }





});



module.exports = router;