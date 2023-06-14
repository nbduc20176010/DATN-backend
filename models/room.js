const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    roomName: {
      require: true,
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
