const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const getStudent = require("../../middleware/getstudent");
const studentmodel = require("../../models/studentmodel");




//jwt secret key 
const jwt_secret = "thisis@secret";




//Signup Route  Without auth required
router.post("/signup",
    //validating request 
    [
        body("firstname").notEmpty().withMessage("First name should not be empty"),
        body("email").notEmpty().withMessage("Email should not be empty").isEmail().withMessage("Email is not correct"),
        body("password").isLength({ min: 5 }).withMessage("Password must be greater then 5 characters"),

    ],
    async (req, res) => {
        //checking for validation errors
        const verrors = validationResult(req);


        if (!verrors.isEmpty()) {
            return res.json(verrors);
        }
        try {

            //using bcrypt for password hashing and salt
            const salt = await bcrypt.genSalt(11);
            const securepassword = await bcrypt.hash(req.body.password, salt);

            //checking if the student already exists in db 
            let student = await studentmodel.findOne({ email: req.body.email });
            if (student != null) {
                return res.json({success:false, msg: "email already in use" });
            }
            student = await studentmodel.create(
                {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: securepassword,

                }
            );
            res.send({
                success: true,
                msg: "student Account is Created"
            });
        }
        catch (err) {
            console.error(err.message);
            return res.json({ error: "Some Error occured in the app" })
        }
    });

//Login Route Without auth
router.post("/login",
    //validating incoming request
    [
        body("email").notEmpty().withMessage("Email should not be empty").isEmail().withMessage("Email is not correct"),
        body("password").notEmpty().withMessage("Please enter your password"),
    ],

    async (req, res) => {
        //object destructring
        const { email, password } = req.body;
        const verrors = validationResult(req);
        if (!verrors.isEmpty()) {
            return res.json(verrors);
        }


        try {
            let student = await studentmodel.findOne({ email });
            if (!student) {
                return res.send({success:false ,msg:"Please provide correct Credentials"});
            }
            const comparepassword = await bcrypt.compare(password, student.password);
            //error if password doesnot match 
            if (!comparepassword) {
                return res.send({success:false ,msg:"Please provide correct Credentials"});
            }
            const data = {
                student: {
                    id: student.id,
                }
            }
            const AuthToken = jwt.sign(data, jwt_secret);
            const studentid = student.id;
            const cstudent = await studentmodel.findById(studentid).select("-password");

            res.json({ success:true,AuthToken:AuthToken,user: cstudent });
        } catch (error) {
            return res.send("Some internal eroro" + error)
        }
    });

// Route for Getting logged in student details - Login - Required

router.get("/getstudent",
    //middleware to fetch student details with the help of token
    getStudent,
    async (req, res) => {

        try {
            const studentid = req.student.id;

            const student = await studentmodel.findById(studentid).select("-password");
            if (!student) {
                return res.send("No student is found against this token");

            }
            res.send(student);

        } catch (error) {
            console.error(error);
            return res.status(500).send("Some internal eroro" + error)
        }
    });

module.exports = router;