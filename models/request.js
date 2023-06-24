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
  sendBy: {
    require: true,
    type: String,
  },
  category: {
    require: true,
    type: String,
    enum: ["schedule", "employee", "class"],
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Declined"],
  },
  body: {},
});

module.exports = mongoose.model("Request", requestModel);
