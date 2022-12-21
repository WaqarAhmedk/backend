const getStudent = require("../../middleware/getstudent");
const DiscussionMessage = require("../../models/discussion chat models/discussionmessagemodel");
const { CreateMessage, Loadmessages } = require("../routes/discussionboard/discussionboardroute");

const rootsocket = (io) => {
  
  io.on("connection", (socket) => {
    const roomname=socket.handshake.query.courseid;
    socket.join(roomname);

    socket.emit("connection", socket.id);

    socket.on("load_message", async (data) => {
      const messages = await Loadmessages(data.discussion);
      io.to(roomname).emit("early_messages", messages)
    });


    socket.on("send_message", async (data) => {
      const result = await CreateMessage(data);
       io.to(roomname).emit("receive_message", result);

    });


  })


}


module.exports = rootsocket;



// socket.on("join_room", async (data) => {

//   socket.join(data);
//   console.log("joined room" + data);
// })

