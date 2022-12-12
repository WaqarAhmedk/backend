const express = require("express");
const getStudent = require("../../middleware/getstudent");
const uploadassignmentmodel = require("../../models/uploadassignments");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const SubmitAssignment = require("../../middleware/submitAssignmentsMiddleware");
const getTeacher = require("../../middleware/getteacher");

router.post("/upload-assignment/:assignmentid", getStudent, SubmitAssignment.single("file"), [
    body("courseid").notEmpty().withMessage("Please provide courseid"),
    body("topicid").notEmpty().withMessage("Please provide topicid"),


], async (req, res) => {

    const errors = validationResult(req);

    if (req.file === undefined) {
        return res.send({
            success: false,
            msg: "PLease Select the file to Upload"
        })

    }
    if (errors.length > 0) {
        return res.send(errors)
    }

    const studentid = req.user.id;

    const uploadtime = Date.now();

    const filename = req.file.filename;
    const assignmentid = req.params.assignmentid;


    const { courseid, topicid } = req.body;
    try {
        const assignment = await uploadassignmentmodel.create({
            studentid: studentid,
            assignmentid: assignmentid,
            courseid: courseid,
            topicid: topicid,
            filename: filename,
            uploadtime: uploadtime,
        });

        res.send({
            success: true,
            msg: "Assignment Uploaded Successfully"
        })
    } catch (error) {
        console.log("Error in Uploading Assignment" + error);
    }

});




router.get("/check-uploaded-assignment/:assignmentid", getStudent, async (req, res) => {
    const studentid = req.user.id;
    const assignmentid = req.params.assignmentid;
    console.log(assignmentid);
    if (assignmentid != "" && assignmentid != undefined) {
        const result = await uploadassignmentmodel.findOne({
            assignmentid: assignmentid,
            studentid: studentid
        });
        if (result) {
            res.send({
                success: true,
                uploaded: true,
                details: result,
            });
        }
        else {
            res.send({
                success: true,
                uploaded: false,

            });
        }
    }



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