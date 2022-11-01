const studentmodel = require("../models/studentmodel");
const teacher = require("../models/teachermodel");
const express = require("express");
const http = require("http");
const app = express();
const socket = require("socket.io");

const dbusers = [];
const users = {};

const socketToRoom = {};

const joinedusers = [];

const meetingsocket = (io) => {



  io.on('connection', socket => {
    socket.on("join room", (roomID, user) => {
      const socketid = socket.id;
      const u = user;
      dbusers.push({ [socketid]:user});
      console.log(dbusers);
      if (users[roomID]) {
        const length = users[roomID].length;
        if (length === 4) {
          socket.emit("room full");
          return;
        }
        users[roomID].push(socket.id);
        dbusers.push({
          socketid: user._id
        })
      } else {
        users[roomID] = [socket.id];
      }
      socketToRoom[socket.id] = roomID;
      const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
      socket.emit("all users", usersInThisRoom ,dbusers);
    });

    socket.on("sending signal", (payload) => {
      io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, user: payload.user.user });
    });

    socket.on("returning signal", payload => {
      io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
      const roomID = socketToRoom[socket.id];
      let room = users[roomID];
      if (room) {
        room = room.filter(id => id !== socket.id);
        users[roomID] = room;
      }
      socket.broadcast.emit('user left', socket.id)
    });

    socket.on('change', (payload) => {
      socket.broadcast.emit('change', payload)
    });

  });



}

module.exports = meetingsocket;














