const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const adminmodel = require("../../models/adminmodel");
const getAdmin = require("../../middleware/getadminmiddleware")





//jwt secret key 
const jwt_secret = "thisis@adminsecret";




//Signup Route  Without auth required
router.post("/admin/signup", async (req, res) => {
    console.log(req.body);

    try {

        //using bcrypt for password hashing and salt
        const salt = await bcrypt.genSalt(11);
        const securepassword = await bcrypt.hash(req.body.password, salt);

        //checking if the admin already exists in db 
        let admin = await adminmodel.findOne({ email: req.body.email });
        if (admin != null) {
            return res.json({ error: "email already in use" });
        }
        admin = await adminmodel.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: securepassword,

            }
        );
        res.send({
            success: true,
            message: "Account waiting for approval from admin"
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Some Error occured in the app" })
    }
});

//Login Route Without auth
router.post("/admin/login", async (req, res) => {
    //object destructring
    const { email, password } = req.body;

    try {
        let admin = await adminmodel.findOne({ email });
        if (!admin) {
            return res.send("Please provide correct Credentials");
        }
        const comparepassword = await bcrypt.compare(password, admin.password);
        //error if password doesnot match 
        if (!comparepassword) {
            return res.send("Please prvide correct credentials");
        }
        if (admin.approved) {
            const data = {
                admin: {
                    id: admin.id,
                }
            }
            const AuthToken = jwt.sign(data, jwt_secret);
            return res.json({ success: true, AuthToken: AuthToken, user: admin });
        }

        res.send({
            success: false,
            msg: "Please Wait for the Approval from admin"
        })

    } catch (error) {
        return res.status(500).send("Some internal eroro" + error)
    }
});

// // Route for Getting logged in admin details - Login - Required

router.get("/getadmin",
    //middleware to fetch admin details with the help of token
    getAdmin,
    async (req, res) => {
        console.log("d");
        try {
            const adminid = req.admin;

            const admin = await adminmodel.findById(adminid).select("-password");
            if (!admin) {
                return res.send("No admin is found against this token");

            }
            else {
                res.send(admin);
            }

        } catch (error) {
            console.error(error);
            res.send("Some internal eroro" + error)
        }
    });

module.exports = router;