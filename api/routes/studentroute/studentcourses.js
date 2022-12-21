
const express = require("express");
const getStudent = require("../../../middleware/getstudent");
const coursemodel = require("../../../models/coursesmodel");
const studentmodel = require("../../../models/studentmodel");
const router = express.Router();


router.get("/get-student-courses", getStudent, async (req, res) => {
    const studentid = req.user.id;
    try {
        const student = await studentmodel.findById(studentid).populate(['courses.course']);
                res.send({ success: true, allcourses: student.courses })

    } catch (err) {
        console.log("error in geeting student courses errois" + err);
    }

});

router.get("/get-all-participents/:courseid", async (req, res) => {

    const courseid = req.params.courseid;
    const students = await studentmodel.find({
        "courses.course": courseid,
    }).select("-password").select("-courses");

    const findinstructor = await coursemodel.findById(courseid).select("teacher").populate("teacher", 'firstname lastname email avatar role');

    
    res.send({
        success: true,
        participents: students,
        instructor:findinstructor
    })



});


module.exports = router;