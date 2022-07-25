const express = require('express');
const getTeacher = require('../middleware/getteacher');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const topicmodel = require('../models/Topicsmodel');
const upload = require('../middleware/uploadpdfmiddleware');
const assignmentmodel = require('../models/assignmentmodel');

//uploading assignment file through multer and handling errors


router.post("/create-assignment", getTeacher,
    // [
    //     body("topicid").notEmpty().withMessage("please provide Topic id"),
    //     body("courseid").notEmpty().withMessage("please provide course id "),
    //     body("title").notEmpty().withMessage("please provide Assignment title "),
    //     body("submissiondate").notEmpty().withMessage("please provide submission date"),
    // ],
    async (req, res) => {

        //error handling for assignment uploading filee
        const uploadassignment = upload.single("file");

        uploadassignment(req, res, async (err) => {


            //if error uploading file
            if (err) {
                return res.status(400).send({ message: err.message })
            }

            //if no error them create assiugnment

            const filepath = req.file.path;


            const errors = validationResult(req);
            const { topicid, courseid, description, title, submissiondate } = req.body;



            if (errors.isEmpty()) {
                try {
                    const assignment = await assignmentmodel.create({
                        topicid: topicid,
                        courseid: courseid,
                        title: title,
                        description: description,
                        filepath: filepath,
                        submissiondate: submissiondate,

                    });

                    res.send({ msg: "Assignment created", assignment: assignment })



                } catch (error) {
                    console.log("create assignment error  " + error);
                }
            } else {
                res.send(errors);

            }


        });



    });





router.post("/update-assignment/:id", getTeacher,
    [

        body("title").notEmpty().withMessage("please provide Assignment title "),
        body("submissiondate").notEmpty().withMessage("please provide submission date"),
    ],
    async (req, res) => {



        const assignmentid = req.params.id;
        const errors = validationResult(req);
        const { description, title, submissiondate } = req.body;



        if (errors.isEmpty()) {
            try {
                await assignmentmodel.findByIdAndUpdate(assignmentid, {
                    title: title,
                    description: description,
                    submissiondate: submissiondate,
                });


                const updatedassignment = await assignmentmodel.findById(assignmentid);
                res.send({ msg: "Assignment updated", assignment: updatedassignment })



            } catch (error) {
                console.log("Update assignment error  " + error);
            }
        } else {
            res.send(errors);

        }


    });


router.get("/get-assignment/:topicid", getTeacher,
    async (req, res) => {


        const topicid = req.params.topicid;
    


        try {


            const assignment = await assignmentmodel.find({ topicid: topicid });


            if (!assignment) {
                res.send("There is no assignment found against this topic")
            } else {
                res.send(assignment)
            }


        } catch (error) {
            console.log("update course " + error);
        }



    });





router.delete("/delete-assignment/:id", getTeacher,
    async (req, res) => {

        const assignmentid = req.params.id;


        try {


            const result = await assignmentmodel.findByIdAndDelete(assignmentid);


            if (!result) {
                res.send("There is no assignment found against this id")
            } else {
                res.send({ msg: "Assignemnt  is deleted and details are", details: result });
            }


        } catch (error) {
            console.log("update course " + error);
        }



    });

module.exports = router;