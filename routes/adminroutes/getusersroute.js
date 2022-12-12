const express = require("express");
const getAdmin = require("../../middleware/getadminmiddleware");
const coursemodel = require("../../models/coursesmodel");
const studentmodel = require("../../models/studentmodel");
const teachermodel = require("../../models/teachermodel");
const topicmodel = require("../../models/Topicsmodel");
const router = express.Router();











router.get("/get-all-teachers", getAdmin, async (req, res) => {
    try {

        const teachers = await teachermodel.find().select("-password");
        res.send({
            success:true,
            teachers:teachers,
        })
    } catch (error) {
        console.log("Admin Error getting techers" + error)
    }


});



router.get("/get-all-students", getAdmin, async (req, res) => {
    try {

        const students = await studentmodel.find().select("-password");
        res.send({
            success:true,
            students:students,
        })
    } catch (error) {
        console.log("Admin Error getting techers" + error)
    }


});


router.get("/get-all-courses-admin", getAdmin, async (req, res) => {
    
    try {

        const course = await coursemodel.find();
   
        
        res.send({
            success:true,
            courses:course
        })
    } catch (error) {
        console.log("Admin Error getting techers" + error)
    }


});

router.delete("/delete-course-byadmin/:id", getAdmin,
    async (req, res) => {
        const courseid = req.params.id;


        try {



            const result = await coursemodel.findByIdAndDelete(courseid);

            if (!result) {
                res.send({ success: false, message: "There is no course found against this id " })
            } else {

                await topicmodel.deleteMany({
                    courseid: courseid
                });


                await studentmodel.updateMany({ "courses.course": courseid }, { $pull: { courses: { course: courseid } } });

                res.send({ succes: true, message: "course is Deleted Successfully", details: result });
            }


        } catch (error) {
            console.log("delete course by admin " + error);
        }

    });




module.exports = router;