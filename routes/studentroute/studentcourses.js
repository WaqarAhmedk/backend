
const express = require("express");
const getStudent = require("../../middleware/getstudent");
const studentmodel = require("../../models/studentmodel");
const router = express.Router();


router.get("/get-student-courses",getStudent,async(req,res)=>{
    const studentid=req.student;
    console.log(studentid);
    try{
     const student=  await studentmodel.findById(studentid);
      res.send({success:true,courses:student.courses})

    }catch(err){
        console.log("error in geeting student courses errois"+err);
    }

});

module.exports = router;