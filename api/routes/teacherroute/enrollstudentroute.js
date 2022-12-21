const express = require('express');
const router = express.Router();
const getTeacher = require('../../../middleware/getteacher');
const course = require('../../../models/coursesmodel');
const Discussion = require('../../../models/discussion chat models/Discussionmodel');
const studentmodel = require('../../../models/studentmodel');
const Student = require('../../../models/studentmodel');


router.post("/find-student-byemail/:email", getTeacher, async (req, res) => {

    const studentemail = req.params.email;


    const student = await Student.findOne({ email: studentemail }).select("-password");
    if (!student) {
        return res.send({ success: false, message: "No student is registered against this email " })
    }
    else {
        res.send({
            success: true,
            student: student,
        })
    }

});

router.post("/enroll-student/:courseid", getTeacher, async (req, res) => {
    const teacherid = req.user.id;
    const courseid = req.params.courseid;
    const studentid = req.body.studentid;

    try {

        const student = await Student.findById(studentid).select("-password");
        const rc = await course.findById(courseid);
        if (!rc) {
            return res.send({ success: fasle, msg: "No course is registered against this id " })

        }
        if (!student) {
            return res.send({ success: false, msg: "No student is registered against this email " })

        }
        else {

            const studentid = student._id;
            const check = await studentmodel.find({ _id: studentid, "courses.course": courseid });


            if (check.length < 1) {

                const checkcourse = await course.findById(courseid);
                console.log(checkcourse);

                await studentmodel.findByIdAndUpdate(studentid, {
                    $push: {
                        courses: {
                            course: checkcourse._id,
                        }
                    }
                });
                const data = await Discussion.findOneAndUpdate({ course: checkcourse._id }, { $push: { users: studentid } });
                res.send({ success: true, msg: "Student is enrolled in this course" })

            } else {
                res.send({ success: false, msg: "Already enrolled in this course" })


            }



        }



    } catch (error) {
        console.log("error in  enroll student " + error);
    }

});

router.post("/delete-enrolled-student/:studnetid/:courseid", getTeacher, async (req, res) => {
    const studnetid = req.params.studnetid;
    const courseid = req.params.courseid;



    try {

        const check = await studentmodel.findByIdAndUpdate(studnetid, { $pull: { courses: { course: courseid } } });
console.log(check);
        res.send({ success: true, message: "Student is deleted from the course" })

    } catch (error) {
        console.log("error in  enroll student " + error);
    }

});


router.get("/get-allparticipants/:courseid", getTeacher, async (req, res) => {
    const courseid = req.params.courseid;
    console.log("cla");

    try {

        const rc = await course.findById(courseid);
        if (!rc) {
            return res.send({ success: fasle, message: "No course is registered against this id " })

        }
        else {

            const check = await studentmodel.find({ "courses.course": courseid });
            if (check.length > 0) {
                res.send({
                    success: true,
                    message: "All particpants ",
                    participants: check
                })
            } else {
                res.send({
                    success: false,
                    message: "Currently no student is Enrolled in this course",

                })
            }

        }



    } catch (error) {
        console.log("error in  enroll student " + error);
    }

});







module.exports = router