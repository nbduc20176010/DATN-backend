const mongoose = require("mongoose");

const classSchema = mongoose.Schema({
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
            image: {
                data: String,
                contentType: String,
            },
        },
    ],
    schedule: [{ day: String, phase: Number, weekDay: String }],
    notes: String,
});

module.exports = mongoose.model("Class", classSchema);
