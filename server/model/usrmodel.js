const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  roomId: {
    type: String,
  },
  userId: {
    type: String,
  },
  host: {
    type: String,
  },
  attendies: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
