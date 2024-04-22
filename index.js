const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatModel = require('./models/chatSchema')

const cors = require("cors");

const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL);

app.use(cors());

app.use("/", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

const server = app.listen(PORT, () => {
  console.log("sever is running on port ", PORT);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData.data._id);

    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
 
  });
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chats;
    if (!chat.users) return console.log("chat.users in not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.send._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});
