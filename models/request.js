const mongoose = require("mongoose");

const requestModel = mongoose.Schema({
  notes: {
    require: true,
    type: String,
  },
  sendDate: {
    require: true,
    type: String,
  },
  accountId: {
    require: true,
    type: String,
  },
  requestFrom: {
    require: true,
    type: String,
    enum: ["teacher", "regular"],
  },
  sendBy: {
    require: true,
    type: String,
  },
  category: {
    require: true,
    type: String,
    enum: ["schedule", "employee", "class", "student"],
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Declined"],
  },
  body: {},
});

module.exports = mongoose.model("Request", requestModel);
