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


], async (req, res) => {

    const errors = validationResult(req);

    if (req.file === undefined) {
        return res.send("please select your assignment")

    }
    if (errors.length > 0) {
        return res.send(errors)
    }

    const studentid = req.user.id;
    const uploadtime = Date.now();
    const filename = req.file.filename;


    const { courseid, assignmentid, topicid } = req.body;
    const assignment = await uploadassignmentmodel.create({
        studentid: studentid,
        assignmentid: assignmentid,
        courseid: courseid,
        topicid: topicid,
        filename: filename,
        uploadtime: uploadtime.toLocaleString(),
    })
    console.log(assignment);

});


router.get("/download-assignment/:filename", (req, res) => {
    const filename = req.params.filename;
    const filepath = "/home/anonymous-kashmiri/Fyp/backend/public/assignments/" + filename;

    console.log(filename);
    try {
        res.download(filepath, (err) => {
            if (err) {
                console.log("error in downloading" + err)

            }
            console.log("Download started");
        });
    } catch (err) { }
});



module.exports = router;