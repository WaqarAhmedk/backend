const express = require("express");
const ConnectDb = require("./db/connection");
const cors = require("cors");
const portno = "4001";
const StudentauthRoute = require("./routes/studentroute/studentauthroute");
const teacherauthroute=require("./routes/teacherroute/teacherauthroute");
const courseroute=require("./routes/courseroute");
const topicroute=require("./routes/topicsroute");
const assignmentroute=require("./routes/assignmentroute")
const enrollstudentsroute=require("./routes/teacherroute/enrollstudentroute")


const app = express();
//middleware to use json in requests and responses
app.use(cors());
app.use(express.json());

//using connectdb function from dbconnect file to connect database
ConnectDb();







//using routes

app.use(StudentauthRoute);



app.use(teacherauthroute);
app.use(courseroute);
app.use(topicroute);
app.use(assignmentroute);


app.use(enrollstudentsroute);





app.listen(portno, () => {
    console.log("App is runing on port " + portno);
});