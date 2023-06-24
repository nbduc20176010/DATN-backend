const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema(
  {
    label: String,
    classes: [
      { shift: Number, class: String, room: String, teacherId: String },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
