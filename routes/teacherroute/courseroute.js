const express = require('express');
const getTeacher = require('../../middleware/getteacher');
const CourseModel = require("../../models/coursesmodel");
const { body, validationResult } = require("express-validator");


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
                const teacherid = req.teacher.id;
                console.log(teacherid);
                const course = await CourseModel.create({
                    teacher: teacherid,
                    coursename: req.body.coursename,

                });
                res.send({ success: true, msg: "Course Created" });

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
        const teacherid = req.teacher.id;
        console.log(teacherid);


        try {


            const result = await CourseModel.find({ teacher: teacherid });

            if (result.length < 1) {
                res.send({ success: false, msg: "No courses are registered by this user " })
            } else {
                res.send({ success: true, courses: result })
            }


        } catch (error) {
            console.log("get all courses error " + error);
        }

    });




router.get("/get-1-course/:id", getTeacher,
    async (req, res) => {
        const courseid = req.params.id;


        try {

            console.log(courseid);
            const result = await CourseModel.findById(courseid);

            if (!result) {
                res.send("No course is found against this id ")
            } else {
                res.send({ msg: "course found ", details: result })
            }


        } catch (error) {
            console.log("delete course " + error);
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

                console.log(courseid);
                await CourseModel.findByIdAndUpdate(courseid, { coursename: coursename });
                const getcourse = await CourseModel.findById(courseid);

                if (!getcourse) {
                    res.send("There is no course found against this id")
                } else {
                    res.send({ msg: "course is Updated and details are", details: getcourse })
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
            console.log(result);

            if (!result) {
                res.send("There is no course found against this id ")
            } else {
                res.send({ msg: "course is Deleted and details are", details: result })
            }


        } catch (error) {
            console.log("delete course " + error);
        }

    });

module.exports = router;
