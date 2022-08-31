const getStudent = require("../middleware/getstudent");
const DiscussionMessage = require("../models/discussion chat models/discussionmessagemodel");
const { CreateMessage, Loadmessages } = require("./discussionboardroute");


const rootsocket = (io) => {
  console.log("socket server Started");

  io.on("connection", (socket) => {

    console.log(`new user connected ${socket.id}`);
    console.log(socket.data);

   
  })


}


module.exports = rootsocket;


// socket.on("send_message", async (data) => {
//   const result = await CreateMessage(data);
//   console.log(data.courseid);
//   socket.to(data.courseid).emit("recieve_message", result)

// });
// socket.on("load_message", async (data) => {
//   const messages = await Loadmessages(data.discussion);
//   socket.emit("early_messages", messages)
// })
// socket.on("join_room", async (data) => {

//   socket.join(data);
//   console.log("joined room" + data);
// })

