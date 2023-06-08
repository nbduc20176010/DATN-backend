const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
    roomName: {
        require: true,
        type: String,
    },
});

module.exports = mongoose.model("Room", roomSchema);
