const express = require('express');
const getTeacher = require('../../../middleware/getteacher');
const CourseModel = require("../../../models/coursesmodel");
const { body, validationResult } = require("express-validator");
const Discussion = require('../../../models/discussion chat models/Discussionmodel');
const topicmodel = require('../../../models/Topicsmodel');
const studentmodel = require('../../../models/studentmodel');


const router = express.Router();


router.post("/create-course",
    [
        body("coursename").notEmpty().withMessage("please provide coursename")
    ]
    , getTeacher,
    async (req, res) => {
        const errors = validationResult(req);


        if (errors.isEmpty()) {
            try {
                const teacherid = req.user.id;
                const course = await CourseModel.create({
                    teacher: teacherid,
                    coursename: req.body.coursename,

                });

                const discusionnboard = await Discussion.create({
                    admin: req.user.id,
                    course: course._id,
                    discusionname: course.coursename,

                });



                res.send({ success: true, msg: "Course Created Successfully", courseid: discusionnboard.course });

            } catch (error) {
                res.send("something bad happend ")
                console.log("create course " + error);
            }


        } else {
            res.json(errors);

        }


    });

router.get("/get-all-courses", getTeacher,
    async (req, res) => {
        const teacherid = req.user.id;


        try {


            const result = await CourseModel.find({ teacher: teacherid }).populate("teacher");

            if (result.length < 1) {
                res.send({ success: false, msg: "No courses are registered by this user " })
            } else {
                res.send({ success: true, courses: result })
            }


        } catch (error) {
            console.log("get all courses error " + error);
        }

    });




router.get("/get-course/:id", getTeacher,
    async (req, res) => {
        const courseid = req.params.id;


        try {

            const result = await CourseModel.findById(courseid);

            if (!result) {
                res.send({ success: false, message: "No course is found against this id " })
            } else {
                res.send({ success: true, message: "course found ", details: result })
            }


        } catch (error) {
            console.log("find course " + error);
        }

    });


router.post("/update-course/:id",
    [
        body("coursename").notEmpty().withMessage("please provide coursename")
    ]
    , getTeacher,
    async (req, res) => {
        const errors = validationResult(req);
        const coursename = req.body.coursename;
        const courseid = req.params.id;

        if (errors.isEmpty()) {
            try {


                await CourseModel.findByIdAndUpdate(courseid, { coursename: coursename });
                const getcourse = await CourseModel.findById(courseid);

                if (!getcourse) {
                    res.send({ success: false, message: "There is no course found against this id" })
                } else {
                    res.send({ success: true, message: "course Name is Updated Succesfully", details: getcourse })
                }


            } catch (error) {
                console.log("update course " + error);
            }


        } else {
            res.json(errors);

        }











    });

router.delete("/delete-course/:id", getTeacher,
    async (req, res) => {
        const errors = validationResult(req);
        const coursename = req.body.coursename;
        const courseid = req.params.id;


        try {

            console.log(courseid);


            const result = await CourseModel.findByIdAndDelete(courseid);

            if (!result) {
                res.send({ success: true, message: "There is no course found against this id " })
            } else {

                await topicmodel.deleteMany({
                    courseid: courseid
                });


                await studentmodel.updateMany({ "courses.course": courseid }, { $pull: { courses: { course: courseid } } });

                res.send({ succes: true, message: "course is Deleted and details are", details: result });
            }


        } catch (error) {
            console.log("delete course " + error);
        }

    });

module.exports = router;
