const express = require('express');
const getTeacher = require('../../middleware/getteacher');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const topicmodel = require('../../models/Topicsmodel');
const upload = require('../../middleware/uploadpdfmiddleware');
const path = require("path");
const { v4: uuid4 } = require("uuid");
const moment = require('moment');
const getStudent = require('../../middleware/getstudent');
const AttendenceModel = require('../../models/attendencemodel');
const studentmodel = require('../../models/studentmodel');






router.post("/create-online-class/:topicid", getTeacher,
    [
        body("title").notEmpty().withMessage("please provide  title "),
        body("classtime").notEmpty().withMessage("please provide class time"),
    ],
    async (req, res) => {

        const topicid = req.params.topicid;
        const errors = validationResult(req);
        if (errors.length > 0) {
            res.send(errors);
        }
        const { title, classtime, description, expirytime } = req.body;
        // const starttime = moment(classtime).format('MMMM Do YYYY, h:mm:ss a');
        // const endtime = moment(expirytime).format('MMMM Do YYYY, h:mm:ss a');


        const check = await topicmodel.findById(topicid);
        if (!check) {
            return res.send({
                success: false,
                msg: "NoTopic is found against this id"
            })

        }


        if (errors.isEmpty()) {

            const starttime = classtime.toLocaleString();
            const endtime = expirytime.toLocaleString();

            try {

                const VideoRoomlink = "/meeting/" + uuid4();

                await topicmodel.findByIdAndUpdate(topicid, {
                    $push:
                    {
                        onlineclass:
                        {
                            title: title,
                            classtime: starttime,
                            expirytime: endtime,
                            description: description,
                            classlink: VideoRoomlink
                        }
                    }
                });
                const data = await topicmodel.findById(topicid);

                res.send({ success: true, message: "Online class is Created for the given topic" })


                // console.log(data);

            } catch (error) {
                console.log("create online class error  " + error);
            }
        } else {
            res.send(errors);

        }


    });







router.post("/update-online-class/:topicid/:classid", getTeacher,
    [

        body("title").notEmpty().withMessage("please provide  title "),
        body("starttime").notEmpty().withMessage("please provide class time")
    ],
    async (req, res) => {

        const topicid = req.params.topicid;
        const classid = req.params.classid;
        const errors = validationResult(req);
        const { title, starttime, expirytime, description } = req.body;
        console.log(topicid);
        console.log(classid);

        if (errors.isEmpty()) {
            try {

                const data = await topicmodel.updateOne({ _id: topicid, 'onlineclass._id': classid },
                    {
                        $set:
                        {
                            "onlineclass.$.title": title,
                            "onlineclass.$.classtime": starttime,
                            "onlineclass.$.expirytime": expirytime,
                            "onlineclass.$.description": description


                        }
                    });
                if (data.acknowledged == true) {
                    const updateddata = await topicmodel.findById(topicid);

                    res.send({
                        success: true,
                        msg: "Online class  is Updated",
                        data: updateddata
                    })
                }


                res.send(data)
            } catch (error) {
                console.log("Update class error  " + error);
            }
        } else {
            res.send(errors);

        }


    });

router.delete("/delete-online-class/:topicid/:classid", getTeacher,
    async (req, res) => {


        const onlineclassid = req.params.classid;
        const topicid = req.params.topicid;






        try {

            const check = topicmodel.findById(topicid);
            if (!check) {
                return res.send({ success: false, msg: "No course found Against this id" })
            }

            //deleting onlineclass in a nested object
            const d = await topicmodel.findByIdAndUpdate(topicid, { $pull: { onlineclass: { _id: onlineclassid } } });

            const data = await topicmodel.findById(topicid);
            res.send({
                success: true,
                msg: "Online class Deleted",
                data: data
            })
        } catch (error) {
            console.log("Online class delete error  " + error);
        }
    }


);
router.get("/start-onlineclass/:topicid/:classid", getTeacher,
    async (req, res) => {

        const onlineclassid = req.params.classid;
        const topicid = req.params.topicid;



        try {

            const data = await topicmodel.findOne(
                { _id: topicid },
                {
                    onlineclass: {
                        '$elemMatch': {
                            "_id": onlineclassid
                        }
                    }
                });

            const timenow = new Date();
            const starttime = new Date(data.onlineclass[0].classtime);
            if (timenow - starttime < 0) {
                return res.send({
                    success: false,
                    allowed: false,
                    message: "Your Class is Scheduled  at " + data.onlineclass[0].classtime.toLocaleString(),
                });
            }
            else {
                const available = new Date(data.onlineclass[0].expirytime);
                if (timenow - available < 0) {

                    const changedclass = await topicmodel.updateOne({ _id: topicid, 'onlineclass._id': onlineclassid },
                        {
                            $set:
                            {

                                "onlineclass.$.started": true,


                            }
                        });
                    const link = data.onlineclass[0].classlink
                    return res.send({
                        success: true,
                        classlink: link

                    })
                }
                else {
                    return res.send({
                        success: false,
                        allowed: false,
                        message: "Your Class is Expired  at " + data.onlineclass[0].expirytime.toLocaleString(),
                    });
                }
            }


        } catch (error) {
            console.log(" find ONline class  id Error  " + error);
        }


    });

router.get("/get-onlineclass/:topicid/:classid", getTeacher,
    async (req, res) => {
        console.log("AD");

        const onlineclassid = req.params.classid;
        const topicid = req.params.topicid;



        try {

            const data = await topicmodel.findOne(
                { _id: topicid },
                {
                    onlineclass: {
                        '$elemMatch': {
                            "_id": onlineclassid
                        }
                    }
                });
            console.log(data);

            res.send({
                success: true,
                data: data.onlineclass[0]
            })
        } catch (error) {
            console.log(" find ONline class  id Error  " + error);
        }


    });


router.get("/start-onlineclass-student/:topicid/:classid", getStudent,
    async (req, res) => {

        const onlineclassid = req.params.classid;
        const topicid = req.params.topicid;



        try {

            const data = await topicmodel.findOne(
                { _id: topicid },
                {
                    onlineclass: {
                        '$elemMatch': {
                            "_id": onlineclassid
                        }
                    }
                });
            console.log(data);
            const timenow = new Date();
            const starttime = new Date(data.onlineclass[0].classtime);
            if (timenow - starttime < 0) {
                return res.send({
                    success: false,
                    allowed: false,
                    message: "Your Class is Scheduled  at " + data.onlineclass[0].classtime.toLocaleString(),
                });
            }
            else {
                const available = new Date(data.onlineclass[0].expirytime);
                if (timenow - available < 0) {

                    res.send({
                        success: true,
                        link: ""
                    })
                }
                else {
                    return res.send({
                        success: false,
                        allowed: false,
                        message: "Your Class is Expired  at " + data.onlineclass[0].expirytime.toLocaleString(),
                    });
                }
            }


        } catch (error) {
            console.log(" find ONline class  id Error  " + error);
        }


    });

router.get("/get-all-students-attendence/:courseid/:classid", async (req, res) => {
    const onlineclassid = req.params.classid;
    const courseid = req.params.courseid;

    console.log(courseid);
    console.log(onlineclassid);

    let notattended = [];
    let attended = [];
    let allstudents = [];


    try {





        const findstudents = await studentmodel.find({ 'courses.course': courseid });

        for (var i = 0; i <= findstudents.length - 1; i++) {
            allstudents.push(findstudents[i]._id);
        }
        const attendedstudents = await AttendenceModel.find({ session: onlineclassid });
        // console.log(attendedstudents.students);

        for (var i = 0; i < attendedstudents[0].students.length; i++) {

            attended.push(attendedstudents[0].students[i].studentid)
        }


        let remainingStudentIDs = allstudents.filter(studentID => !attended.toString().includes(studentID.toString()));





        //students attende quiz
        const result = await AttendenceModel.find({ session: onlineclassid }).populate({
            path: "students.studentid",
            select: "-password"
        });
        let presenids = result[0].students.map(item => item.studentid);

        const remainingStudents = await studentmodel.find().select('-password -courses').where('_id').in(remainingStudentIDs).exec();

        const presentStudents = await studentmodel.find().select('-password -courses').where('_id').in(presenids).exec();




        res.send({
            success: true,
            present: presentStudents,
            absent: remainingStudents
        });








    }




    catch (error) {
        console.log("error in getting class attendence by student" + error);

    }





});



module.exports = router;