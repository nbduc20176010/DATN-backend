const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema(
  {
    label: String,
    shift: Number,
    class: String,
    room: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
