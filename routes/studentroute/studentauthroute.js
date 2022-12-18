const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const getStudent = require("../../middleware/getstudent");
const studentmodel = require("../../models/studentmodel");
const multer = require("multer");
const path = require("path");
const fs = require("fs")

const uploadAvatar = require("../../middleware/uploadAvatarmiddleware");
const { profile } = require("console");




//jwt secret key 
const jwt_secret = process.env.STUDENT_JWT_SECRET;;




//Signup Route  Without auth required
router.post("/signup", uploadAvatar.single('image'), async (req, res) => {

    const { firstname, lastname, email, password } = req.body;
    if (req.file === undefined) {
        return res.send({
        success:false,
        msg:"Please Provide Your Avatar"
        })

    }
   
        const file = req.file;
        console.log(file);
        const ext = path.extname(file.originalname);
        const name = await req.body.firstname + req.body.lastname + ext;


    try {

        //using bcrypt for password hashing and salt
        const salt = await bcrypt.genSalt(11);
        const securepassword = await bcrypt.hash(password, salt);

        //checking if the student already exists in db 
        let student = await studentmodel.findOne({ email: req.body.email });
        if (student != null) {
            return res.json({ success: false, msg: "email already in use" });
        }
        const createdstudent = await studentmodel.create(
            {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: securepassword,
                avatar: name,

            }
        );
       

        const foldername = createdstudent._id.toString();
        const dpath = path.join(__dirname, '..', '../../learnify/src/labeled_images/' + foldername);


        fs.access(dpath, (error) => {
            if (error) {

                fs.mkdir(dpath, { recursive: true }, (error) => {
                    if (error) {
                        console.log("Error " + error);

                    } else {
                        console.log("New Folder" + foldername + "Created");
                    }
                })
            }

        })

        res.send({
            success: true,
            msg: "Student Account is Created"
        });
    }
    catch (err) {
        console.error(err.message);
        return res.json({ error: "Some Error occured in the app" })
    }
});




router.post("/upload/images/:userid", async (req, res) => {
    let j = 0;

    const userid = req.params.userid;
    const storage = multer.diskStorage({


        destination: (req, file, callback) => {

            const foldername = userid.toString();
            const dpath = path.join(__dirname, '..', '../../learnify/src/labeled_images/' + foldername);





            callback(null, dpath);
        },
        filename: (req, file, callback) => {

            j++


            const name = j + path.extname(file.originalname);
            console.log(name);

            callback(null, name);
        },

    });


    const uploadimage = multer({
        storage: storage, fileFilter: (req, file, cb) => {
            console.log(file.mimetype);
            if (file.mimetype === "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error("Images with only jpeg extension are accepted"));

            }
        }
    });


    const upload = uploadimage.array('images')
    upload(req, res, async (error) => {

        if (req.files === undefined) {
            return res.send({
                success: false,
                message: "No File is Attached Please Select a file to Upload"
            })
        }
        else if (error) {
            console.log("Ds" + error);
            return res.send({ success: false, message: error.message })
        }
        try {



            const data = await studentmodel.findByIdAndUpdate(userid, {
                images: true
            });
            j = 0;

            return res.send({
                success: true,
                msg: "Images Uploaded Successfully"
            });
        }
        catch (err) {
            console.error("sdsdsds " + err.message);
            return res.json({ error: "Some Error occured in the app" })
        }
    })

})
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
                return res.send({ success: false, msg: "Please provide correct Credentials" });
            }
            const comparepassword = await bcrypt.compare(password, student.password);
            //error if password doesnot match 
            if (!comparepassword) {
                return res.send({ success: false, msg: "Please provide correct Credentials" });
            }
            const data = {
                user: {
                    id: student.id,
                }
            }
            const AuthToken = jwt.sign(data, jwt_secret);
            const studentid = student.id;
            const cstudent = await studentmodel.findById(studentid).select("-password");
            if (cstudent.images === true) {
                res.json({ success: true, AuthToken: AuthToken, user: cstudent });

            }
            else {
                res.json({ images: false, userid: cstudent._id });

            }

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
            const studentid = req.user.id;
            console.log(studentid + "ss");

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

router.post("/update-profile", async (req, res) => {

    let { firstname, lastname, newemail, currentemail, currentpassword, newpassword } = req.body;
    console.log(newemail);
    if (newpassword === "") {
        newpassword = currentpassword;

    }


    try {
        let student = await studentmodel.findOne({ email: currentemail });
        if (!student) {
            return res.send({ success: false, msg: "Please provide correct Email No Student is Registred with this email" });
        }
        const comparepassword = await bcrypt.compare(currentpassword, student.password);
        //error if password doesnot match 
        if (!comparepassword) {
            return res.send({ success: false, msg: "Please provide correct Password" });
        }

        const salt = await bcrypt.genSalt(11);
        const securepassword = await bcrypt.hash(newpassword, salt);
        if (newemail === "") {
            newemail = currentemail;
        } else if (newemail != currentemail) {
            let newmail = await studentmodel.findOne({ email: newemail });
            if (newmail) {
                return res.send({
                    success: false,
                    msg: "Your new Email " + newemail + " is already taken"
                })

            }
            else {
                console.log(firstname, lastname, newemail, currentemail, currentpassword, newpassword);
                const data = await studentmodel.findByIdAndUpdate(student._id, {
                    firstname: firstname,
                    lastname: lastname,
                    email: newemail,
                    password: securepassword,

                });

                const updated = await studentmodel.findOne({ email: newemail }).select("-password");
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




module.exports = router;