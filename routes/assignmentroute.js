const express = require('express');
const getTeacher = require('../middleware/getteacher');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const topicmodel = require('../models/Topicsmodel');
const upload = require('../middleware/uploadpdfmiddleware');

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
        const changedate =new Date(submissiondate);
        changedate.setSeconds(0,0);
        console.log(changedate);

        try {

            await topicmodel.findByIdAndUpdate(topicid, {
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
            const data = await topicmodel.findById(topicid);

            res.send({ success: true, messsage: "Assignment Created for the given topic", details: data })



        } catch (error) {
            console.log("create assignment error  " + error);
            res.send("some error occureed try again ")
        }



    });



});



router.post("/update-assignment/:topicid", getTeacher,
    [

        body("title").notEmpty().withMessage("please provide Assignment title "),
        body("description").notEmpty().withMessage("please provide Assignment Description "),
        body("submissiondate").notEmpty().withMessage("please provide submission date"),
    ],
    async (req, res) => {



        const topicid = req.params.topicid;
        const errors = validationResult(req);
        const { description, assignmentid, title, submissiondate } = req.body;


        //  Submissiondate should be inproper date format else it will through error

        console.log(assignmentid);
        if (errors.isEmpty()) {
            try {

                const data = await topicmodel.updateOne({ _id: topicid, 'assignments._id': assignmentid },
                    {
                        $set:
                        {
                            "assignments.$.title": title,
                            "assignments.$.description": description,
                            "assignments.$.submissiondate": submissiondate
                        }
                    });
                if (data.acknowledged == true) {
                    const updateddata = await topicmodel.findById(topicid);

                    res.send({
                        success: true,
                        msg: "Assignment is Updated",
                        data: updateddata
                    })
                }


                res.send(data)
            } catch (error) {
                console.log("Update assignment error  " + error);
            }
        } else {
            res.send(errors);

        }


    });

router.post("/delete-assignment/:topicid", getTeacher,
    body("assignmentid").notEmpty().withMessage("please provide Assignment id "),
    async (req, res) => {


        const topicid = req.params.topicid;
        const errors = validationResult(req);
        const { assignmentid } = req.body;


        console.log(assignmentid);
        if (errors.isEmpty()) {
            try {

                //deletinmg assignment in a nested object
                await topicmodel.findByIdAndUpdate(topicid, { $pull: { assignments: { _id: assignmentid } } });
                const data = await topicmodel.findById(topicid);
                res.send({
                    success: true,
                    msg: "Assignment Deleted",
                })
            } catch (error) {
                console.log("Update assignment error  " + error);
            }
        } else {
            res.send(errors);

        }


    });



// todo in future
router.get("/get-assignment/:topicid", getTeacher,
    async (req, res) => {


        const topicid = req.params.topicid;



        try {




        } catch (error) {
            console.log("update course " + error);
        }



    });







module.exports = router;