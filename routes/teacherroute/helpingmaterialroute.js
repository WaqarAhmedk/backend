const express = require('express');
const getTeacher = require('../../middleware/getteacher');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const topicmodel = require('../../models/Topicsmodel');
const upload = require('../../middleware/uploadpdfmiddleware');

//uploading assignment file through multer and handling errors


router.post("/create-helpingmaterial/:topicid", getTeacher,
    async (req, res) => {
        const topicid = req.params.topicid;

        //error handling for assignment uploading filee
        const uploadhelpingmaterial = upload.single("file");

        uploadhelpingmaterial(req, res, async (err) => {


            //if error uploading file
            if (err) {
                return res.send({ message: err.message })
            }

            //if no error them create assignment

            const filepath = req.file.path;


            const { title, description } = req.body;

            try {

                await topicmodel.findByIdAndUpdate(topicid, {
                    $push:
                    {
                        helpingmaterial:
                        {
                            title: title,
                            file: filepath,
                            description: description,
                        }
                    }
                });
                const data = await topicmodel.findById(topicid);

                res.send({ success: true, msg: "Helping materail is Created for the given course" })


                // console.log(data);

            } catch (error) {
                console.log("create helping material error  " + error);
            }



        });



    });



router.post("/update-helpingmaterial/:topicid", getTeacher,
    [

        body("title").notEmpty().withMessage("please provide Assignment title "),
        body("description").notEmpty().withMessage("please provide Assignment title "),
        body("helpingmaterialid").notEmpty().withMessage("please provide helpingmaterial id"),
    ],
    async (req, res) => {



        const topicid = req.params.topicid;
        const errors = validationResult(req);
        const { description, helpingmaterialid, title } = req.body;



        if (errors.isEmpty()) {
            try {

                const data = await topicmodel.updateOne({ _id: topicid, 'helpingmaterialid._id': helpingmaterialid },
                    {
                        $set:
                        {
                            "helpingmatrial.$.title": title,
                            "helpingmatrial.$.description": description,
                        }
                    });
                if (data.acknowledged == true) {
                    const updateddata = await topicmodel.findById(topicid);

                    res.send({
                        success: true,
                        msg: "Helping Material is Updated",
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

router.post("/delete-helpingmaterial/:topicid", getTeacher,
    body("helpingmaterialid").notEmpty().withMessage("please provide Helpingmaterial id "),
    async (req, res) => {


        const topicid = req.params.topicid;
        const errors = validationResult(req);
        const { helpingmaterialid } = req.body;



        if (errors.isEmpty()) {
            try {

                //deletinmg helpigmatrial in a nested object
                await topicmodel.findByIdAndUpdate(topicid, { $pull: { helpingmaterial: { _id: helpingmaterialid } } });
                const data = await topicmodel.findById(topicid);
                res.send({
                    success: true,
                    msg: "Helping Material Deleted",
                    data: data
                })
            } catch (error) {
                console.log("Update assignment error  " + error);
            }
        } else {
            res.send(errors);

        }


    });


router.get("/get-helpingmaterial/:topicid", getTeacher,
    async (req, res) => {


        const topicid = req.params.topicid;



        try {


            // to be implemented

        } catch (error) {
            console.log("update course " + error);
        }



    });







module.exports = router;