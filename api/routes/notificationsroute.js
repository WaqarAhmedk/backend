const express = require("express");
const getStudent = require("../../middleware/getstudent");
const studentmodel = require("../../models/studentmodel");
const StudentNotificationModel = require("../../models/StudentNotificationmodel");
const router = express.Router();
const notifications = [];



router.get("/studentnotifications", getStudent, async (req, res) => {

    const studentid = req.user.id;
    const student = await studentmodel.findById(studentid).populate(['courses.course']);
    // console.log(student.courses[0].course);
    const courses=[];

    // console.log(student.courses);
    for(var i=0; i<=student.courses.length-1; i++){
        courses.push(student.courses[i].course._id)
    }
    const records = await StudentNotificationModel.find().where('course').in(courses).exec();
    console.log(records);

    res.send({
        success: true,
        notifications: records
    })


})

module.exports = router;