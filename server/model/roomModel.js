const mongoose = require("mongoose");

const DrawingCommandSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["stroke", "clear"],
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // flexible structure for stroke data
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,

    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  drawingData: {
    type: [DrawingCommandSchema],
    default: [],
  },
});

const Room = mongoose.model("Room", RoomSchema);
module.exports = Room;
