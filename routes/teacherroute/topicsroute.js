const express = require('express');
const getTeacher = require('../../middleware/getteacher');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const topicmodel = require('../../models/Topicsmodel');
const coursemodel = require('../../models/coursesmodel');


router.post("/create-topic/:courseid", getTeacher, [
    body("title").notEmpty().withMessage("please provide Topic title ")
], async (req, res) => {
    const errors = validationResult(req);
    const courseid = req.params.courseid;
    const { title } = req.body;


    if (errors.isEmpty()) {
        try {
            const topic = await topicmodel.create({
                courseid: courseid,
                title: title,

            });



            res.send({ success: true, msg: "Topic created", topic: topic })


        } catch (error) {
            res.send("something bad happend")
            console.log("create topic error  " + error);
        }
    } else {
        res.send(errors);

    }

});


router.get("/get-topics/:courseid",
    async (req, res) => {

        const courseid = req.params.courseid;
        console.log(courseid);


        try {


            const topics = await topicmodel.find({ courseid: courseid });

            if (topics.length < 1) {
                res.send({ success: false, msg: "There is no topics found against this courseid" })
            } else {
                res.send({ success: true, topics: topics })
            }


        } catch (error) {
            console.log("get topics error " + error);
        }



    });

router.get("/get-topic-data/:topicid", getTeacher,
    async (req, res) => {

        const topicid = req.params.topicid;
        console.log(topicid);


        try {

            const data = await topicmodel.findById(topicid);
            res.send(data);

        } catch (error) {
            console.log("update course " + error);
        }



    });


router.post("/update-topic/:id",
    [
        body("title").notEmpty().withMessage("please provide coursename")
    ]
    , getTeacher,
    async (req, res) => {
        const errors = validationResult(req);
        const title = req.body.title;
        const topicid = req.params.id;

        if (errors.isEmpty()) {
            try {


                await topicmodel.findByIdAndUpdate(topicid, { title: title });
                const gettopic = await topicmodel.findById(topicid);

                if (!gettopic) {
                    res.send("There is no topic found against this id")
                } else {
                    res.send({ msg: "topic  is Updated and details are", details: gettopic })
                }


            } catch (error) {
                console.log("update course " + error);
            }


        } else {
            res.json(errors);

        }
    });


router.delete("/delete-topic/:id", getTeacher,
    async (req, res) => {
        const topicid = req.params.id;


        try {


            const result = await topicmodel.findByIdAndDelete(topicid);


            if (!result) {
                res.send("There is no topic found against this id")
            } else {
                res.send({ msg: "topic  is deleted and details are", details: result });
            }


        } catch (error) {
            console.log("delete course " + error);
        }



    });

module.exports = router;