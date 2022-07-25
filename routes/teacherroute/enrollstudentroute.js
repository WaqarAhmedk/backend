const express = require('express');
const router = express.Router();
const getTeacher = require('../../middleware/getteacher');
const enrolledmodel = require('../../models/enrolledcourses');
const Student = require('../../models/studentmodel');


router.post("/enroll-student/:courseid", getTeacher, async (req, res) => {
    const teacherid = req.teacher.id;
    const courseid = req.params.courseid;
    const studentemail = req.body.studentemail;

    try {

        const student = await Student.findOne({ email: studentemail }).select("-password");
        if (!student) {
            res.send("No student is registered against this email ")

        }
        else {

            const studentid = student._id;
            const check = await enrolledmodel.findOne({ courseid: courseid, studentid: studentid });
            if (!check) {
                console.log("ddd");
                const result = await enrolledmodel.create({
                    courseid: courseid,
                    studentid: studentid,
                    teacherid: teacherid,

                });
                res.send("Student is enrolled in this course")

            } else {
                res.send("already enrolled in this course")


            }



        }



    } catch (error) {
        console.log("error in  enroll student " + error);
    }

});












module.exports = router