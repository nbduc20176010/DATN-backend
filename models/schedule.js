const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema(
  {
    label: String,
    classes: [
      {
        shift: Number,
        classId: String,
        class: String,
        room: String,
        teacherId: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
