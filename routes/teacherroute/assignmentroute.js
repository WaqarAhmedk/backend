const express = require('express');
const getTeacher = require('../../middleware/getteacher');
const router = express.Router();
const { validationResult } = require("express-validator");
const topicmodel = require('../../models/Topicsmodel');
const upload = require('../../middleware/uploadpdfmiddleware');
const Notifications = require("../notificationsroute");
const coursemodel = require('../../models/coursesmodel');
const StudentNotificationModel = require('../../models/StudentNotificationmodel');
const moment = require("moment");
const path = require('path')
const uploadassignmentmodel = require('../../models/uploadassignments');
const zip = require("express-zip")


//uploading assignment file through multer and handling errors
router.post("/create-assignment/:topicid", getTeacher, async (req, res) => {
    const topicid = req.params.topicid;
    //Multer function for handling multer errors 
    const uploadassignment = upload.single("file");


    uploadassignment(req, res, async (err) => {


        const errors = validationResult(req);
        const { courseid, description, title, submissiondate } = req.body;
        if (courseid === "" || title === "" || submissiondate === "") {
            return res.send({
                success: false,
                message: "Please Provide all the Required fields courseid ,title and Submission date"
            })

        }

        //if error uploading file
        if (err) {
            return res.send({ success: false, message: err.message })
        }

        //if no file is attached
        if (req.file === undefined) {
            return res.send({
                success: false,
                message: "No File is Attached Please Select a file to Upload"
            })
        }

        const file = req.file.filename;



        const check = await topicmodel.findById(topicid);

        if (!check) {
            res.send({ success: false, message: "No Topic found against this id" })

        }
        const changedate = submissiondate.toLocaleString();



        try {

            const data = await topicmodel.findByIdAndUpdate(topicid, {
                $push:
                {
                    assignments:
                    {
                        course: courseid,
                        title: title,
                        description: description,
                        filename: file,
                        submissiondate: changedate
                    }
                }
            });

            res.send({ success: true, message: "Assignment Created for the given topic", details: data });
            const detail = await coursemodel.findById(data.courseid);
            var timenow = moment();

            await StudentNotificationModel.create({
                text: `New Assignment ${title} is Created for Topic ${data.title} in  ${detail.coursename} Course with due date -> ${changedate} `,
                course: data.courseid,
                time: timenow

            });


        } catch (error) {
            console.log("create assignment error  " + error);
            res.send("some error occureed try again ")
        }



    });



});



router.post("/update-assignment/:topicid/:assignmentid", getTeacher,


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
                const detail = await coursemodel.findById(updateddata.courseid);
                var timenow = moment();


                await StudentNotificationModel.create({
                    text: `Assignment ${title} is Updated for Topic ${updateddata.title} in  ${detail.coursename} Course with due date -> ${submissiondate.toLocaleString()} `,
                    course: updateddata.courseid,
                    time: timenow

                });
                res.send({
                    success: true,
                    msg: "Assignment is Updated",
                    data: updateddata
                })
            }
            else {
                res.send({
                    success: false,
                    msg: "Assignment Not Updated Please Try again"
                })

            }



        } catch (error) {
            console.log("Update assignment error  " + error);
        }
    }
);

router.delete("/delete-assignment/:topicid/:assignmentid", getTeacher,
    async (req, res) => {


        const topicid = req.params.topicid;
        const assignmentid = req.params.assignmentid;
        const errors = validationResult(req);



        try {

            //deletinmg assignment in a nested object
            const a = await topicmodel.findByIdAndUpdate(topicid, { $pull: { assignments: { _id: assignmentid } } });
            const data = await topicmodel.findById(topicid);
            res.send({
                success: true,
                msg: "Assignment Deleted Successfully",
            })
        } catch (error) {
            console.log("Delete Assignment Error  " + error);
        }
    }

);



router.get("/get-assignment/:topicid/:assignmentid", getTeacher,
    async (req, res) => {


        const assignmentid = req.params.assignmentid;
        const topicid = req.params.topicid;



        try {

            const data = await topicmodel.findOne(
                { _id: topicid },
                {
                    assignments: {
                        '$elemMatch': {
                            "_id": assignmentid
                        }
                    }
                });

            res.send({
                success: true,
                data: data.assignments[0]
            })
        } catch (error) {
            console.log("Assignment find b id Error  " + error);
        }


    });



router.get("/get-assignment-records/:topicid/:assignmentid", async (req, res) => {
    const assignmentid = req.params.assignmentid;
    const topicid = req.params.topicid;



    try {
        const result = await uploadassignmentmodel.find({ topicid: topicid, assignmentid: assignmentid }).populate("studentid", '-password -courses');
        res.send({
            success: true,
            students: result
        })
    } catch (error) {
        console.log("Error in get assignment result" + error)

    }

})


router.get("/get-all-assignments/:topicid/:assignmentid", async (req, res) => {
    const assignmentid = req.params.assignmentid;
    const topicid = req.params.topicid;


    const file = path.join(__dirname);
    const filepath = "public/assignments/";

    console.log(file);





    try {
        const result = await uploadassignmentmodel.find({ topicid: topicid, assignmentid: assignmentid }).populate("studentid", '-password -courses');

        let zzip = [];



        for (var i = 0; i < result.length; i++) {
            const file = "/home/anonymous-kashmiri/Fyp/backend/public/student-assignments/" + result[i].filename;
            console.log(file);
            zzip.push({ path: file, name: result[i].filename });
        }
        res.zip(zzip);

    } catch (error) {
        console.log("Error in get all assignment result" + error)

    }

})



module.exports = router;
