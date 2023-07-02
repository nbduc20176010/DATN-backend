const mongoose = require("mongoose");

const classSchema = mongoose.Schema(
  {
    className: {
      require: true,
      type: String,
    },
    room: {
      require: true,
      type: String,
    },
    teacher: {
      type: {
        _id: String,
        fullName: String,
        email: String,
        phoneNumber: String,
        image: {
          data: String,
          contentType: String,
        },
      },
    },
    numberOfStudents: Number,
    maxStudents: {
      require: true,
      type: Number,
    },
    students: [
      {
        _id: String,
        fullName: String,
        phoneNumber: String,
        email: String,
        absent: {
          type: Number,
          default: 0,
          min: 0,
        },
        midScore: {
          type: Number,
          min: 0,
          max: 100,
        },
        finalScore: {
          type: Number,
          min: 0,
          max: 100,
        },
        image: {
          data: String,
          contentType: String,
        },
      },
    ],
    schedule: [{ label: String, shift: Number }],
    notes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Class", classSchema);
