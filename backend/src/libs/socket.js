import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

const onlineUsers={}; // userID: socketID

export function getReceiverSocketId(userId) {
  return onlineUsers[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userID = socket.handshake.query.userID;
  onlineUsers[userID] = socket.id;

  io.emit("getOnlineUsers", Object.keys(onlineUsers).map(Number));

  // Join group rooms dynamically
  socket.on("joinGroup", (groupId) => {
      socket.join(`group_${groupId}`);
      console.log(`User ${userID} joined group ${groupId}`);
  });

  socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      delete onlineUsers[userID];
      io.emit("getOnlineUsers", Object.keys(onlineUsers).map(Number));
  });
});

export { server, io, app };
