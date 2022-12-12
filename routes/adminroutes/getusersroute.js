const express = require("express");
const getAdmin = require("../../middleware/getadminmiddleware");
const studentmodel = require("../../models/studentmodel");
const teachermodel = require("../../models/teachermodel");
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







module.exports = router;