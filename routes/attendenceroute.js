const express = require("express");
const getStudent = require("../middleware/getstudent");
const AttendenceModel = require("../models/attendencemodel");
const router = express.Router();


router.post("/markattendence/:courseid/:topicid/:classid", getStudent, async (req, res) => {

    const studentid = req.user.id;
    const courseid = req.params.courseid;
    const topicid = req.params.topicid;
    const classid = req.params.classid;



    try {

        const data = await AttendenceModel.findOne({ "students.studenid": studentid });
        if (data) {
            return res.send({
                success: true,
                msg: "Already marked Attendence"
            })
        }


        const att = await AttendenceModel.create({
            course: courseid,
            session: classid,
            topic: topicid,
            students: [
                {
                    studentid: studentid,
                    status: "present",
                    timespent: "0"
                }
            ]
        });

        res.send({
            success: true,
            msg: "Attendence Marked for this Online Session"
        })


    } catch (error) {
        console.log("Eroor in Attendence route" + error);

    }




});








module.exports = router;