const express = require('express');
const getTeacher = require('../../middleware/getteacher');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const topicmodel = require('../../models/Topicsmodel');
const upload = require('../../middleware/uploadpdfmiddleware');
const e = require('express');

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

            res.send({ success: true, message: "Assignment Created for the given topic", details: data })



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

                    res.send({
                        success: true,
                        msg: "Assignment is Updated",
                        data: updateddata
                    })
                }
                else{
                    res.send({
                        success:false,
                        msg:"Assignment Not Updated Please Try again"
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
        const assignmentid=req.params.assignmentid;
        const errors = validationResult(req);

     
        
            try {

                //deletinmg assignment in a nested object
              const a=  await topicmodel.findByIdAndUpdate(topicid, { $pull: { assignments: { _id: assignmentid } } });
                const data = await topicmodel.findById(topicid);
                console.log(a);
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
            console.log(data);

            res.send({
                success: true,
                data: data.assignments[0]
            })
        } catch (error) {
            console.log("Assignment find b id Error  " + error);
        }


    });







module.exports = router;