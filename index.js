require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://samchat123.herokuapp.com/",
    method: ["GET", "POST"],
  },
});
const username = require("username-generator");
const cors = require("cors");
app.use(cors());

const users = {};
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userid = username.generateUsername("-");
  if (!users[userid]) {
    users[userid] = socket.id;
  }
  //send back username
  socket.emit("yourID", userid);
  io.sockets.emit("allUsers", users);

  socket.on("disconnect", () => {
    delete users[userid];
  });

  socket.on("callUser", (data) => {
    io.to(users[data.userToCall]).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(users[data.to]).emit("callAccepted", data.signal);
  });

  socket.on("close", (data) => {
    io.to(users[data.to]).emit("close");
  });

  socket.on("rejected", (data) => {
    io.to(users[data.to]).emit("rejected");
  });
});

app.get("/", (req, res) => {
  res.send("server is running");
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`server running on ${PORT}`));
