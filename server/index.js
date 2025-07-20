const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./model/db");
const { addUser } = require("./controller/userController");
const Room = require("./model/roomModel");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this for security in production
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

let roomIdGlobal = null;
let imageURLGlobal = null;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("userJoined", async (data) => {
    const { name, roomId, userId, host, attendies } = data;
    const users = addUser({ name, roomId, userId, host, attendies });

    const newRoom = new Room({
      roomId: roomId,
      drawingData: [
        {
          type: "stroke",
          data: {
            path: [
              [0, 0],
              [10, 10],
            ],
            stroke: "#000",
            lineWidth: 2,
          },
        },
      ],
    });
    await newRoom.save();
    if (!roomId) return;

    roomIdGlobal = roomId;
    socket.join(roomId);

    // Notify the user that they joined successfully
    socket.emit("userIsJoined", { success: true, roomId, host, name, users });

    // Share the current whiteboard image with the new user
    socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
      imageURL: imageURLGlobal,
    });
  });

  socket.on("whiteboardData", (data) => {
    if (!roomIdGlobal) return;

    imageURLGlobal = data;

    // Broadcast the updated whiteboard image to others in the room
    socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
      imageURL: data,
    });
  });

  socket.on("draw-stroke", async (data) => {
    console.log(data);
    const newCommand = { data, timestamp: new Date() };

    // Push the new drawing command to the drawingData array
    await Room.updateOne(
      { roomId: roomIdGlobal },
      {
        $push: { drawingData: newCommand },
        $set: { lastActivity: new Date() }, // optional: update activity
      }
    );
    socket.broadcast.emit("draw-stroke", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});
