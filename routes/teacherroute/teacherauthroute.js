const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Teacher = require("../../models/teachermodel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const getTeacher = require("../../middleware/getteacher");




//jwt secret key 
const jwt_secret = "thisis@teacherSecret";




//Signup Route  Without auth required
router.post("/teacher/signup",
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

            //checking if the teacher already exists in db 
            let teacher = await Teacher.findOne({ email: req.body.email });
            if (teacher != null) {
                return res.json({ success: false, msg: "email already in use" });
            }
            teacher = await Teacher.create(
                {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: securepassword,

                }
            );
            res.json({ success: true, msg: "Teacher Account is Created" });


        }
        catch (err) {
            console.error(err.message);
            return res.json({ error: "Some Error occured in the app" })
        }
    });

//Login Route Without auth
router.post("/teacher/login",
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
            let teacher = await Teacher.findOne({ email });
            if (!teacher) {
                return res.send("Please provide correct Credentials");
            }
            const comparepassword = await bcrypt.compare(password, teacher.password);
            //error if password doesnot match 
            if (!comparepassword) {
                return res.send("Please prvide correct credentials");
            }
            const data = {
                teacher: {
                    id: teacher.id,
                }
            }
            const AuthToken = jwt.sign(data, jwt_secret);
            const teacherid = teacher.id;
            const cteacher = await Teacher.findById(teacherid).select("-password");

            res.json({ success:true , AuthToken:AuthToken , user:cteacher });
        } catch (error) {
            return res.send("Some internal eroro" + error)
        }
    });

// Route for Getting logged in teacher details - Login - Required

router.get("/getteacher",
    //middleware to fetch teacher details with the help of token
    getTeacher,
    async (req, res) => {

        try {
            const teacherid = req.teacher.id;

            const teacher = await Teacher.findById(teacherid).select("-password");
            if (!teacher) {
                return res.send("No teacher is found against this token");

            }
            res.send(teacher);

        } catch (error) {
            console.error(error);
            return res.send("Some internal eroro" + error)
        }
    });

module.exports = router;