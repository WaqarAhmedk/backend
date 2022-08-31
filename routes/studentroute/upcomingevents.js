const express = require("express");
const getStudent = require("../../middleware/getstudent");
const studentmodel = require("../../models/studentmodel");
const topicmodel = require("../../models/Topicsmodel");
const router = express.Router();


router.get("/get-all-upcoming-events", getStudent, async (req, res) => {

    let topic = [];
    let assignments = [];
    let onlineclass = [];
    const studentid = req.user.id;
    console.log(studentid);


    const data = await studentmodel.findById(studentid);

    await Promise.all(data.courses.map(async (da) => {
        topic = await topicmodel.find({ courseid: da.courseid });
    }))


    await Promise.all(topic.map((item) => {

        
         assignments.push(item.assignments);
         onlineclass.push(item.onlineclass);

        // onlineclass.push(item.onlineclass);



    }));
//flat method will make all the arrays a single array
    const allassignments=assignments.flat();
    const allonlineclasses=onlineclass.flat();
    const allevents=allassignments.concat(allonlineclasses)
    
    res.send({
        allevents:allevents
    })

})





module.exports = router;








