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
const notificationsroute = require("./routes/notificationsroute")

const testonlineclassqoute = require("./routes/dummyroute");
const attendenceroute = require("./routes/attendenceroute");
const adminauthroute = require("./routes/adminroutes/adminauthroute");
const getuserroute = require("./routes/adminroutes/getusersroute")


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

require("./routes/meetingsocket")(io);
//dicussion gro messags socket
require("./routes/rootsocket")(io);
