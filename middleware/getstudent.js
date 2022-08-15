const jwt = require('jsonwebtoken');
const jwt_secret = "thisis@secret";

const getStudent = (req, res, next) => {

    //getting the token from the header
   
   try {
    const token = req.header('student-auth-token');
    if (!token) {
       return res.send("Please provde a  token");
    }
    const data = jwt.verify(token, jwt_secret);
    req.student = data.student.id;
       
   } catch (error) {
       console.error(error);
     return  res.send("Please provide a valid token to authnticate");
   }

    //next will execute next function which will be after the middleware in the routes
    next();
};




module.exports = getStudent;