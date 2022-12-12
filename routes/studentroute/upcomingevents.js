const express = require("express");
const getStudent = require("../../middleware/getstudent");
const getTeacher = require("../../middleware/getteacher");
const coursemodel = require("../../models/coursesmodel");
const studentmodel = require("../../models/studentmodel");
const topicmodel = require("../../models/Topicsmodel");
const router = express.Router();


router.get("/get-all-upcoming-events", getStudent, async (req, res) => {

    let topic = [];
    let assignments = [];
    let onlineclass = [];
    let quiz = [];
    const studentid = req.user.id;


    const data = await studentmodel.findById(studentid);


    // console.log(data);
    for (var i = 0; i < data.courses.length; i++) {
        const t = await topicmodel.find({ courseid: data.courses[i].course }).populate(['quiz.quizref']);
        topic.push(t)


    }
    const alltopics = topic.flat();
    // console.log(alltopics);

    for (var i = 0; i < alltopics.length; i++) {
        for (var j = 0; j < alltopics[i].quiz.length; j++) {
            quiz.push(alltopics[i].quiz[j].quizref);



        }
        assignments.push(alltopics[i].assignments);
        onlineclass.push(alltopics[i].onlineclass);
    }







    //flat method will make all the arrays a single array
    const allassignments = assignments.flat();
    const allonlineclasses = onlineclass.flat();
    const allquiz = quiz.flat();
    const allevents = allassignments.concat(allonlineclasses, allquiz)

    res.send({
        allevents: allevents
    })

})

router.get("/get-all-tasks", getStudent, async (req, res) => {

    let topic = [];
    let assignments = [];
    let onlineclass = [];
    let quiz = [];
    const studentid = req.user.id;


    const data = await studentmodel.findById(studentid);


    // console.log(data);
    for (var i = 0; i < data.courses.length; i++) {
        const t = await topicmodel.find({ courseid: data.courses[i].course }).populate(['quiz.quizref']);
        topic.push(t)


    }
    const alltopics = topic.flat();
    // console.log(alltopics);

    for (var i = 0; i < alltopics.length; i++) {
        for (var j = 0; j < alltopics[i].quiz.length; j++) {
            quiz.push(alltopics[i].quiz[j].quizref);



        }
        assignments.push(alltopics[i].assignments);
        onlineclass.push(alltopics[i].onlineclass);
    }







    //flat method will make all the arrays a single array
    const allassignments = assignments.flat();
    const allonlineclasses = onlineclass.flat();
    const allquiz = quiz.flat();
    // const allevents = allassignments.concat(allonlineclasses, allquiz)

    res.send({
        assignments: allassignments,
        onlineclasses: allonlineclasses,
        quizes: allquiz
    })

})

router.get("/get-all-upcoming-events-teacher", getTeacher, async (req, res) => {

    let topic = [];

    let assignments = [];
    let onlineclass = [];
    let quiz = [];
    const teacherid = req.user.id;


    // const data = await studentmodel.findById(studentid);
    const data = await coursemodel.find({ teacher: teacherid });

    for (var i = 0; i < data.length; i++) {
        const t = await topicmodel.find({ courseid: data[i]._id }).populate(['quiz.quizref']);
        console.log(t);
        topic.push(t)


    }
    const alltopics = topic.flat();
    console.log(alltopics);

    for (var i = 0; i < alltopics.length; i++) {
        for (var j = 0; j < alltopics[i].quiz.length; j++) {
            quiz.push(alltopics[i].quiz[j].quizref);



        }
        assignments.push(alltopics[i].assignments);
        onlineclass.push(alltopics[i].onlineclass);
    }







    //flat method will make all the arrays a single array
    const allassignments = assignments.flat();
    const allonlineclasses = onlineclass.flat();
    const allquiz = quiz.flat();
    const allevents = allassignments.concat(allonlineclasses, allquiz)

    res.send({
        allevents: allevents
    })

})

module.exports = router;








