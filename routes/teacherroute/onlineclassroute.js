const express = require('express');
const getTeacher = require('../../middleware/getteacher');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const topicmodel = require('../../models/Topicsmodel');
const upload = require('../../middleware/uploadpdfmiddleware');
const path = require("path");
const { v4: uuid4 } = require("uuid");
const moment = require('moment')






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
        const t = moment(classtime).format('MMMM Do YYYY, h:mm:ss a');
        console.log(t);

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







router.post("/update-online-class/:topicid/:classid", getTeacher,
    [

        body("title").notEmpty().withMessage("please provide  title "),
        body("starttime").notEmpty().withMessage("please provide class time")
    ],
    async (req, res) => {

        const topicid = req.params.topicid;
        const classid=req.params.classid;
        const errors = validationResult(req);
        const {  title, starttime} = req.body;
        console.log(topicid);
        console.log(classid);

        if (errors.isEmpty()) {
            console.log("a");
            try {

                const data = await topicmodel.updateOne({ _id: topicid, 'onlineclass._id':classid },
                    {
                        $set:
                        {
                            "onlineclass.$.title": title,
                            "onlineclass.$.classtime": starttime
                        }
                    });
                    console.log(data);
                if (data.acknowledged == true) {
                    const updateddata = await topicmodel.findById(topicid);
                    console.log(data);

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






module.exports = router;