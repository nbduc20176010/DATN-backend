const mongoose = require("mongoose");

const studentScheema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      require: true
    },
    fullName: {
      type: String,
      require: true
    },
    image: {
      data: String,
      contentType: String,
    },
    email: {
      type: String,
      require: true
    },
    phoneNumber: {
      type: String,
      require: true
    },
    age: {
      type: Number,
      require: true
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      require: true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentScheema);
