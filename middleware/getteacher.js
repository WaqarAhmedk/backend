
const jwt = require('jsonwebtoken');
const jwt_secret = "thisis@teacherSecret";

const getTeacher = (req, res, next) => {

    //getting the token from the header
   
   try {
    const token = req.header('teacher-auth-token');
    if (!token) {
       return res.status(401).send("Please provde a  token");
    }
    const data = jwt.verify(token, jwt_secret);
    req.teacher = data.teacher;
       
   } catch (error) {
       console.error(error);
     return  res.status(401).send("Please provide a valid token to authnticate");
   }

    //next will execute next function which will be after the middleware in the routes
    next();
};




module.exports = getTeacher;