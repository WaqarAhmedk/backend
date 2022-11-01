const express = require("express");
const ConnectDb = require("./db/connection");
const cors = require("cors");
const dotenv = require("dotenv");
const socket = require("socket.io");
const { ExpressPeerServer } = require("peer")
const StudentauthRoute = require("./routes/studentroute/studentauthroute");
const teacherauthroute = require("./routes/teacherroute/teacherauthroute");
const courseroute = require("./routes/teacherroute/courseroute");
const topicroute = require("./routes/teacherroute/topicsroute");
const assignmentroute = require("./routes/teacherroute/assignmentroute")
const enrollstudentsroute = require("./routes/teacherroute/enrollstudentroute");
const helpingmaterialroute = require("./routes/teacherroute/helpingmaterialroute");
const onlineclassroute = require("./routes/teacherroute/onlineclassroute");
const studentassignmentroute = require("./routes/studentroute/studnetassignment")
const studentcoursesroute = require("./routes/studentroute/studentcourses");
const eventroute = require("./routes/studentroute/upcomingevents");
const quizroute = require("./routes/teacherroute/onlinequiz");

const testonlineclassqoute=require("./routes/dummyroute")


const app = express();
const server = require("http").createServer(app)

dotenv.config();
//middleware to use json in requests and responses
app.use(cors());
app.use(express.json());

//using connectdb function from dbconnect file to connect database
ConnectDb();







//using routes

app.use(StudentauthRoute);
app.use(studentassignmentroute);
app.use(studentcoursesroute);
app.use(eventroute);

// teacher
app.use(teacherauthroute);
app.use(courseroute);
app.use(topicroute);
app.use(enrollstudentsroute);
app.use(assignmentroute);
app.use(onlineclassroute);
app.use(helpingmaterialroute);
app.use(quizroute);

app.use(testonlineclassqoute)

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`App is runing on port ${PORT}`);
});




const io = socket("4001", {
    cors: {
        origin: "*",
    }

});
const peerServer = ExpressPeerServer(server, {
    debug: true,
});
app.use("/peerjs",peerServer);

require("./routes/meetingsocket")(io);
//dicussion gro messags socket
require("./routes/rootsocket")(io);

const moment=require('moment')
const t=moment().format('MMMM Do YYYY, h:mm:ss a');


console.log(t);