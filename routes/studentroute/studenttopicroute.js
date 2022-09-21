
const express = require("express");
const getStudent = require("../../middleware/getstudent");
const router = express.Router();








router.get("/get-topics/:courseid", getStudent,
    async (req, res) => {

        const courseid = req.params.courseid;


        try {


            const topics = await topicmodel.find({ courseid: courseid });

            if (!topics) {
                res.send("There is no topics found against this courseid")
            } else {
                res.send(topics)
            }


        } catch (error) {
            console.log("update course " + error);
        }



    });

module.exports = router;