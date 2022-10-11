const studentmodel = require("../models/studentmodel");
const teacher = require("../models/teachermodel");

const joinedusers = [];

const meetingsocket = (io) => {


  io.on("connection", (socket) => {


    socket.on("join-room",async (room_id, userid) => {

      joinedusers.push(userid);
      const user=await teacher.findById(userid).select("-password");

      socket.join(room_id);
      console.log("user joined this room" + room_id);
      socket.to(room_id).emit("user-connected", user)
    })

  })


}

module.exports = meetingsocket;


