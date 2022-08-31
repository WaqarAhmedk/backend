
const express = require("express");
const getStudent = require("../../middleware/getstudent");
const coursemodel = require("../../models/coursesmodel");
const studentmodel = require("../../models/studentmodel");
const router = express.Router();


router.get("/get-student-courses", getStudent, async (req, res) => {
    const studentid = req.user.id;
    console.log(studentid);
    try {
        const student = await studentmodel.findById(studentid);
        console.log(student);
        res.send({ success: true, courses: student.courses })

    } catch (err) {
        console.log("error in geeting student courses errois" + err);
    }

});

router.get("/get-all-participents/:courseid", async (req, res) => {

    const courseid = req.params.courseid;
    const students = await studentmodel.find({
        "courses.courseid": courseid,
    }).select("-password").select("-courses");

    const findinstructor = await coursemodel.findById(courseid).select("teacher").populate("teacher", 'firstname email avatar role');
    console.log(findinstructor);

    
    res.send({
        success: true,
        participents: students,
        instructor:findinstructor
    })



});


module.exports = router;