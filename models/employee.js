const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
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
    salary: {
      type: Number,
      min: 0,
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
    role: {
      require: true,
      type: String,
      enum: ["teacher"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);
