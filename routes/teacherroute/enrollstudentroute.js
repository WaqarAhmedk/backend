const express = require('express');
const router = express.Router();
const getTeacher = require('../../middleware/getteacher');
const course = require('../../models/coursesmodel');
const Discussion = require('../../models/discussion chat models/Discussionmodel');
const studentmodel = require('../../models/studentmodel');
const Student = require('../../models/studentmodel');


router.post("/enroll-student/:courseid", getTeacher, async (req, res) => {
    const teacherid = req.user.id;
    const courseid = req.params.courseid;
    const studentemail = req.body.studentemail;

    try {

        const student = await Student.findOne({ email: studentemail }).select("-password");
        const rc = await course.findById(courseid);
        if (!rc) {
            return res.send("No course is registered against this id ")

        }
        if (!student) {
            return res.send("No student is registered against this email ")

        }
        else {

            const studentid = student._id;



            const check = await studentmodel.find({ _id: studentid, "courses.courseid": courseid });


            if (check.length < 1) {

                const checkcourse = await course.findById(courseid);
                console.log(checkcourse);

                await studentmodel.findByIdAndUpdate(studentid, {
                    $push: {
                        courses: {
                            courseid: checkcourse._id,
                            coursename: checkcourse.coursename,
                            teacherid: teacherid,

                        }
                    }
                });
                const data = await Discussion.findOneAndUpdate({ course: checkcourse._id }, { $push: { users: studentid } });
                console.log(data);
                res.send("Student is enrolled in this course")

            } else {
                res.send("already enrolled in this course")


            }



        }



    } catch (error) {
        console.log("error in  enroll student " + error);
    }

});

router.post("/delete-enrolled-student/:studnetid", getTeacher, async (req, res) => {
    const teacherid = req.user.id;
    const studnetid = req.params.studnetid;
    const courseid = req.body.courseid;

    try {

        const check = await studentmodel.findByIdAndUpdate(studnetid, { $pull: { courses: { courseid: courseid } } });

        res.send("Student is deleted from the course")







    } catch (error) {
        console.log("error in  enroll student " + error);
    }

});










module.exports = router