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

module.exports = mongoose.model("DrawingModel", DrawingCommandSchema);
