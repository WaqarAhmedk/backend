const express = require('express');
const getTeacher = require('../../middleware/getteacher');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const topicmodel = require('../../models/Topicsmodel');
const upload = require('../../middleware/uploadpdfmiddleware');
const path = require("path");
const { v4: uuid4 } = require("uuid");





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
        const { title, classtime } = req.body;
        const check = await topicmodel.findById(topicid);
        console.log(check);
        if (!check) {
            return res.send({
                success: false,
                msg: "NoTopic is found against this id"
            })

        }


        if (errors.isEmpty()) {

            const starttime = classtime.toLocaleString()

            try {

                const VideoRoomlink = "/meeting/" + uuid4();

                await topicmodel.findByIdAndUpdate(topicid, {
                    $push:
                    {
                        onlineclass:
                        {
                            title: title,
                            classtime: starttime,
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







router.post("/update-online-class/:topicid", getTeacher,
    [

        body("title").notEmpty().withMessage("please provide  title "),
        body("classtime").notEmpty().withMessage("please provide class time"),],
    async (req, res) => {

        const topicid = req.params.topicid;
        const errors = validationResult(req);
        const { onlineclassid, title, classtime, classlink } = req.body;


        const starttime = classtime.toLocaleString();
        if (errors.isEmpty()) {
            try {

                const data = await topicmodel.updateOne({ _id: topicid, 'onliceclass._id': onlineclassid },
                    {
                        $set:
                        {
                            "onlineclass.$.title": title,
                            "onlineclass.$.classlink": classlink,
                            "onlineclass.$.classtime": starttime
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
                console.log("Update assignment error  " + error);
            }
        } else {
            res.send(errors);

        }


    });

router.post("/delete-online-class/:classid", getTeacher,
    body("topicid").notEmpty().withMessage("please provide topic id "),
    async (req, res) => {


        const onlineclassid = req.params.classid;

        const errors = validationResult(req);
        const { topicid } = req.body;



        if (errors.isEmpty()) {
            try {

                const check = topicmodel.findById(topicid);
                if (!check) {
                    return res.send({ success: false, msg: "No course found against this id" })
                }

                //deletinmg onlineclass in a nested object
                const d = await topicmodel.findByIdAndUpdate(topicid, { $pull: { onlineclass: { _id: onlineclassid } } });
                console.log(d);
                const data = await topicmodel.findById(topicid);
                res.send({
                    success: true,
                    msg: "Online class Deleted",
                    data: data
                })
            } catch (error) {
                console.log("Online class delete error  " + error);
            }
        } else {
            res.send(errors);

        }


    });


router.get("/get-assignment/:topicid", getTeacher,
    async (req, res) => {


        const topicid = req.params.topicid;



        try {




        } catch (error) {
            console.log("update course " + error);
        }



    });






module.exports = router;