const express = require("express");
const getStudent = require("../../middleware/getstudent");
const uploadassignmentmodel = require("../../models/uploadassignments");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const upload = require("../../middleware/uploadpdfmiddleware");

router.post("/upload-assignment", getStudent, upload.single("file"), [
    body("courseid").notEmpty().withMessage("Please provide courseid"),
    body("assignmentid").notEmpty().withMessage("Please provide assignmentid"),
    body("topicid").notEmpty().withMessage("Please provide topicid"),


],async(req, res) => {

    const errors = validationResult(req);

    if (req.file === undefined) {
        return res.send("please select your assignment")

    }
    if (errors.length>0) {
        return res.send(errors)
    }

    const studentid = req.user.id;
    const uploadtime = Date.now();
    const filename = req.file.filename;


    const { courseid, assignmentid, topicid } = req.body;
    const assignment =await uploadassignmentmodel.create({
        studentid: studentid,
        assignmentid: assignmentid,
        courseid: courseid,
        topicid: topicid,
        filename: filename,
        uploadtime: uploadtime,
    })
    console.log(assignment);

});



module.exports = router;