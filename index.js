const express = require("express");
const ConnectDb = require("./db/connection");
const cors = require("cors");
const dotenv = require("dotenv");
const socket = require("socket.io");
const { ExpressPeerServer } = require("peer")
const StudentauthRoute = require("./api/routes/studentroute/studentauthroute");
const teacherauthroute = require("./api/routes/teacherroute/teacherauthroute");
const courseroute = require("./api/routes/teacherroute/courseroute");
const topicroute = require("./api/routes/teacherroute/topicsroute");
const assignmentroute = require("./api/routes/teacherroute/assignmentroute")
const enrollstudentsroute = require("./api/routes/teacherroute/enrollstudentroute");
const helpingmaterialroute = require("./api/routes/teacherroute/helpingmaterialroute");
const onlineclassroute = require("./api/routes/teacherroute/onlineclassroute");
const studentassignmentroute = require("./api/routes/studentroute/studnetassignment")
const studentcoursesroute = require("./api/routes/studentroute/studentcourses");
const eventroute = require("./api/routes/studentroute/upcomingevents");
const quizroute = require("./api/routes/teacherroute/onlinequiz");
const notificationsroute = require("./api/routes/notificationsroute")

const testonlineclassqoute = require("./api/routes/dummyroute");
const attendenceroute = require("./api/routes/attendenceroute");
const adminauthroute = require("./api/routes/adminroutes/adminauthroute");
const getuserroute = require("./api/routes/adminroutes/getusersroute")


const app = express();
const server = require("http").createServer(app)

dotenv.config();
//middleware to use json in requests and responses
app.use(cors());
app.use(express.json());
app.use(express.static('public'))

//using connectdb function from dbconnect file to connect database
ConnectDb();


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`App is runing on port ${PORT}`);
});




const io = socket(process.env.SOCKET_PORT || 4001, {
    cors: {
        origin: "*",
    }

});


//using routes

app.use(StudentauthRoute);
app.use(studentassignmentroute);
app.use(studentcoursesroute);
app.use(eventroute);

app.use(notificationsroute);



// teacher
app.use(teacherauthroute);
app.use(assignmentroute);
app.use(quizroute);
app.use(onlineclassroute);

app.use(courseroute);
app.use(topicroute);
app.use(enrollstudentsroute);
app.use(helpingmaterialroute);

app.use(testonlineclassqoute);
app.use(attendenceroute)





// Admin Route



app.use(adminauthroute);
app.use(getuserroute)


const peerServer = ExpressPeerServer(server, {
    debug: true,
});
app.use("/peerjs", peerServer);

require("./api/routes/meetingsocket")(io);
//dicussion gro messags socket
require("./api/routes/rootsocket")(io);
