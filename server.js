const http = require("http");
const express = require("express");
const cors = require("cors");
const io = require("socket.io");
const path = require("path");
const config = require("./config");

// setup server
const app = express();
const server = http.createServer(app);

const socketIo = io(server);

// Allow CORS
app.use(cors());

// Render a API index page
app.get("/", (req, res) => {
  res.send("<html><body>Chat server</body></html>");
});

// Start listening
server.listen(config.port);
console.log(`Started on port ${config.port}`);

// Setup socket.io
socketIo.on("connection", socket => {
  const username = socket.handshake.query.username;
  console.log(`${username} connected`);

  socket.on("client:message", data => {
    console.log("client:message", data);
    // message received from client, now broadcast it to everyone else
    socket.broadcast.emit("server:message", data);
  });

  socket.on("disconnect", () => {
    console.log(`${username} disconnected`);
  });
});
