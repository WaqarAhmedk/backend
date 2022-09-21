

const meetingsocket = (io) => {

  io.on("connection", (socket) => {
    

      socket.on("join-room", (room_id ,userid) => {

        socket.join(room_id);
        console.log(room_id);
        socket.to(room_id).emit("user-connected",userid)
      })

  })


}

module.exports = meetingsocket;


