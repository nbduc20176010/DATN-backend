const mongoose = require("mongoose");

const refreshTokenSchema = mongoose.Schema({
    token: {
        type: String,
    },
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
