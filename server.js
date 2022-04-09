const express = require("express");
const app = express();
const router = require("./routes/router");
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const formatter = require("./utils/formatter");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const botName = "Atom Bot 🤖";
io.on("connection", (socket) => {
  //runs when client joins a room
  socket.on("JoinRoom", ({ username, room }) => {
    //difrentiate the users to their corresponding rooms
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit(
      "message",
      formatter(botName, `welcome to the chat ${user.username}`)
    );

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatter(botName, `${user.username} has joined the chat`)
      );
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMsg", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatter(user.username, msg));
  });
  socket.on("typing", () => {
    const user = getCurrentUser(socket.id);
    socket.broadcast
      .to(user.room)
      .emit("typing", formatter(botName, `${user.username} is typing...`));
  });
  //runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatter(botName, `${user.username} has left the chat`)
      );
      //send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("server is up");
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(router);
