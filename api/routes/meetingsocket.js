const studentmodel = require("../../models/studentmodel");
const teacher = require("../../models/teachermodel");
const express = require("express");
const http = require("http");
const app = express();
const socket = require("socket.io");


const users = {};

const socketToRoom = {};

const TrackUsers = []

const meetingsocket = (io) => {



  io.on('connection', socket => {
    socket.on("join room", (roomID, username) => {
      if (users[roomID]) {
        const length = users[roomID].length;
        if (length === 4) {
          socket.emit("room full");
          return;
        }
        users[roomID].push({ id: socket.id, username: username });

      } else {
        users[roomID] = [{ id: socket.id, username: username }];
      }
      socketToRoom[socket.id] = roomID;

      const usersInThisRoom = users[roomID].filter(item => {
        if (item.id !== socket.id) {
          return item

        }
      });

      socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", (payload) => {
      io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, username: payload.username });
    });

    socket.on("returning signal", payload => {
      io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id, username: payload.username });
    });

    socket.on('disconnect', () => {
      const roomID = socketToRoom[socket.id];
      let room = users[roomID];
      console.log(room);
      if (room) {
        room = room.filter(item => item.id !== socket.id);
        users[roomID] = room;
      }
      socket.broadcast.emit('user left', socket.id)
    });

    socket.on('change', (payload) => {
      socket.broadcast.emit('change', payload)
    });

    socket.on("time-spent", (data) => {
      console.log(data);
    })

  });



}

module.exports = meetingsocket;














