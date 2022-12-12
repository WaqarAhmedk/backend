const jwt = require("jsonwebtoken");
const jwt_secret = "thisis@adminsecret";

const getAdmin = (req, res, next) => {


    try {

        const token = req.header("admin-auth-token");


        if (!token) {
            res.send("please provide Auth token")
        }
        else {
            const data = jwt.verify(token, jwt_secret,);
          

            req.admin = data.admin.id;
            next();
        }



    } catch (error) {
        console.log("in auth token middleare " + error);
        res.send("Please provide a valid auth token")

    }
  




}
module.exports = getAdmin;