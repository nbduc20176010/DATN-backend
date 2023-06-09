const mongoose = require("mongoose");

const studentScheema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
    },
    fullName: {
        type: String,
    },
    image: {
        data: String,
        contentType: String,
    },
    email: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    age: {
        type: Number,
    },
    sex: {
        type: String,
        enum: ["male", "female"],
    },
});

module.exports = mongoose.model("Student", studentScheema);
