const express = require("express");
const getStudent = require("../../middleware/getstudent");
const getTeacher = require("../../middleware/getteacher");
const Quizmodel = require("../../models/onlinequizmodel");
const topicmodel = require("../../models/Topicsmodel");
const CourseModel = require("../../models/coursesmodel");
const studentmodel = require("../../models/studentmodel");
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

router.post("/update-quiz/:topicid/:assignmentid", getTeacher,
    [

    ],

    async (req, res) => {



        const topicid = req.params.topicid;
        const assignmentid = req.params.assignmentid;
        const errors = validationResult(req);

        const { title, description, submissiondate } = req.body;
        
            try {

                const data = await topicmodel.updateOne({ _id: topicid, 'assignments._id': assignmentid },
                    {
                        $set:
                        {
                            "assignments.$.title": title,
                            "assignments.$.description": description,
                            "assignments.$.submissiondate": submissiondate.toLocaleString(),
                        }
                    });
                if (data.acknowledged == true) {
                    const updateddata = await topicmodel.findById(topicid);

                    res.send({
                        success: true,
                        msg: "Assignment is Updated",
                        data: updateddata
                    })
                }
                else{
                    res.send({
                        success:false,
                        msg:"Assignment Not Updated Please Try again"
                    })
                    
                }


               
            } catch (error) {
                console.log("Update assignment error  " + error);
            }
        }
);

router.delete("/delete-quiz/:topicid/:quizid", getTeacher,
    async (req, res) => {


        const topicid = req.params.topicid;
        const quizid=req.params.quizid;

     
        
            try {

              const a=  await topicmodel.findByIdAndUpdate(topicid, { $pull: { quiz: { _id: quizid} } });
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

  const time = new Date();
  const data = await Quizmodel.findById(quizid);




  if (time.toLocaleString() >= data.quiztime.toLocaleString()) {



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
        time: time.toLocaleString(),
      });
    }


  }
  else {
    res.send({
      success: true,
      allowed: false,
      message: "Your Quiz is not Available at this time it will start at " + data.quiztime.toLocaleString(),
    });
  }

});




router.get("/get-quiz-details/:quizid", getStudent, async (req, res) => {
  const quizid = req.params.quizid;
  const studentid = req.user.id
  const time = new Date();
  const data = await Quizmodel.findById(quizid);

  if (time.toLocaleString() >= data.quiztime.toLocaleString()) {



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
      message: "Your Quiz is not Available at this time it will start at " + data.quiztime.toLocaleString(),
    });
  }


});


router.get("/get-quiz-alldetails/:quizid", async (req, res) => {
  const quizid = req.params.quizid;
  const time = new Date();
  const data = await Quizmodel.findById(quizid);
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
            attemptedquestions: attemptedquestions
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


router.get("/get-all-students-quiz-result/:quizid", async (req, res) => {
  const quizid = req.params.quizid;

  let notattended = [];
  let attended = [];


  try {

    //students attende quiz
    const result = await Quizmodel.findById(quizid).populate({
      path: "students.student",
      select: "-password"
    })

    if (result) {


      const data = await studentmodel.find({ "courses.course": result.course });


      //todo Find users who have nit attended the quiz



      res.send({
        success: true,
        details: result,
      });


    }





  }




  catch (error) {
    console.log("error in getting quiz result by student" + error);

  }





});



module.exports = router;