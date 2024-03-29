const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Teacher = require("../../models/teachermodel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const path = require('path')
const getTeacher = require("../../middleware/getteacher");

const uploadAvatar = require("../../middleware/uploadAvatarmiddleware");
const updateTeacherAvatarMiddleware = require("../../middleware/updateteachermiddleware");


//jwt secret key 
const jwt_secret = process.env.TEACHER_JWT_SECRET;




//Signup Route  Without auth required
router.post("/teacher/signup", uploadAvatar.single("image"), async (req, res) => {

    const { firstname, lastname, email, password } = req.body;
    const file = req.file;
    const ext = path.extname(file.originalname);
    const name = await firstname + lastname + ext;




    try {

        //using bcrypt for password hashing and salt
        const salt = await bcrypt.genSalt(11);
        const securepassword = await bcrypt.hash(password, salt);

        //checking if the teacher already exists in db 
        let teacher = await Teacher.findOne({ email: email });
        if (teacher != null) {
            return res.json({ success: false, msg: "email already in use" });
        }
        teacher = await Teacher.create(
            {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: securepassword,
                avatar: name

            }
        );
        console.log(teacher);
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
                return res.send({ success: false, msg: "Please provide correct Credentials" });
            }
            const comparepassword = await bcrypt.compare(password, teacher.password);
            //error if password doesnot match 
            if (!comparepassword) {
                return res.send({ success: false, msg: "Please provide correct Credentials" });
            }

            const data = {
                user: {
                    id: teacher.id,
                }
            }
            const AuthToken = jwt.sign(data, jwt_secret);
            const teacherid = teacher.id;
            const cteacher = await Teacher.findById(teacherid).select("-password");

            res.json({ success: true, AuthToken: AuthToken, user: cteacher });
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
            const teacherid = req.user.id;

            const teacher = await Teacher.findById(teacherid).select("-password");
            if (!teacher) {
                return res.send({ success: false, message: "No teacher is found against this token" });

            }
            res.send(teacher);

        } catch (error) {
            console.error(error);
            return res.send("Some internal eroro" + error)
        }
    });


router.post("/update-teacher-profile", async (req, res) => {

    let { firstname, lastname, newemail, currentemail, currentpassword, newpassword } = req.body;
    console.log(newemail);
    if (newpassword === "") {
        newpassword = currentpassword;

    }


    try {
        let teacher = await Teacher.findOne({ email: currentemail });
        if (!teacher) {
            return res.send({ success: false, msg: "Please provide correct Email No Teachet is Registred with this email" });
        }
        const comparepassword = await bcrypt.compare(currentpassword, teacher.password);
        //error if password doesnot match 
        if (!comparepassword) {
            return res.send({ success: false, msg: "Please provide correct Password" });
        }

        const salt = await bcrypt.genSalt(11);
        const securepassword = await bcrypt.hash(newpassword, salt);
        if (newemail === "") {
            newemail = currentemail;
        } else if (newemail != currentemail) {
            let newmail = await Teacher.findOne({ email: newemail });
            if (newmail) {
                return res.send({
                    success: false,
                    msg: "Your new Email " + newemail + " is already taken"
                })

            }
            else {
                console.log(firstname, lastname, newemail, currentemail, currentpassword, newpassword);
                const data = await Teacher.findByIdAndUpdate(student._id, {
                    firstname: firstname,
                    lastname: lastname,
                    email: newemail,
                    password: securepassword,

                });

                const updated = await Teacher.findOne({ email: newemail }).select("-password");
                res.send({
                    success: true,
                    msg: "Profile Updated",
                    user: updated
                })
            }
        }




    } catch (error) {

    }













});

router.post("/update-teacher-avatar/:teacherid", async (req, res) => {

    const updateAvatar = updateTeacherAvatarMiddleware.single('avatar');
    updateAvatar(req, res, async (error) => {

        if (req.file === undefined) {
            return res.send({
                success: false,
                message: "No file attached"
            })
        }
        else if (error) {
            console.log("Ds" + error);
            return res.send({ success: false, message: error.message })
        }
        else {
            res.send({
                success: true,
                message: "File Uploaded Successfully"
            })
        }

    })
});
module.exports = router;