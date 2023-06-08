const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
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
    salary: {
        type: Number,
        min: 0,
    },
    age: {
        type: Number,
    },
    sex: {
        type: String,
        enum: ["male", "female"],
    },
    role: {
        require: true,
        type: String,
        enum: ["teacher"],
    },
});

module.exports = mongoose.model("Employee", employeeSchema);
