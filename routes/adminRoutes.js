const express = require("express");
const employeeModel = require("../models/employee");
const studentModel = require("../models/student");
const accountModel = require("../models/account");
const classModel = require("../models/class");

const multer = require("multer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminRoutes = express.Router();

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, "uploads");
        } else {
            cb(null, false);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.filename + ".jpg");
    },
});
const upload = multer({ storage: storage });

//verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Token is not valid!" });
            }
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ message: "You are not authorized" });
    }
};

//get all employees
adminRoutes.get("/teacher", verifyToken, async (req, res) => {
    try {
        if (req.user.role === "admin") {
            const employees = await employeeModel.find();
            res.status(200).json(employees);
        } else {
            res.json({ message: "not permited" });
        }
    } catch (error) {
        res.json({ message: error.message });
    }
});

//add new teacher
adminRoutes.post(
    "/teacher",
    verifyToken,
    upload.single("image"),
    async (req, res) => {
        try {
            if (req.user.role === "admin") {
                if (accountModel.findOne({ username: req.body.username })) {
                    res.status(400).json({
                        message: "Account already existed!",
                    });
                }
                const { username, password, ...rest } = req.body;
                const account = new accountModel({
                    username,
                    password,
                    role: "teacher",
                });
                const newAccount = await account.save();
                const employee = new employeeModel({
                    _id: newAccount._id,
                    ...rest,
                    image: {
                        data: req.file.filename,
                        contentType: req.file.mimetype,
                    },
                    role: "teacher",
                });
                const newEmployee = await employee.save();
                res.status(200).json(newEmployee);
            } else {
                res.json({ message: "not permited" });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
);

//update teacher
adminRoutes.put(
    "/teacher/:id",
    verifyToken,
    upload.single("image"),
    async (req, res) => {
        try {
            if (req.user.role === "admin") {
                const teacherId = req.params.id;
                const { _id, ...updateTeacher } = req.body;
                const result = await employeeModel.findByIdAndUpdate(
                    teacherId,
                    {
                        $set: {
                            ...updateTeacher,
                            image: req.file && {
                                data: req.file.filename,
                                contentType: req.file.mimetype,
                            },
                        },
                    },
                    { new: true }
                );
                res.send(result);
            } else {
                res.json({ message: "not permited" });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
);

//delete teacher
adminRoutes.delete("/teacher/:id", verifyToken, async (req, res) => {
    try {
        if (req.user.role === "admin") {
            const teacherId = req.params.id;
            await employeeModel.findByIdAndDelete(teacherId);
            const res = await employeeModel.findByIdAndDelete(teacherId);
            res.send(res._id);
        } else {
            res.json({ message: "not permited" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//add new student
adminRoutes.post(
    "/student",
    verifyToken,
    upload.single("image"),
    async (req, res) => {
        try {
            if (req.user.role === "admin") {
                const { username, password, ...rest } = req.body;
                if (!accountModel.findOne({ username: req.body.username })) {
                    res.status(400).json({
                        message: "Account already existed!",
                    });
                }
                const account = new accountModel({
                    username,
                    password,
                    role: "regular",
                });
                const newAccount = await account.save();
                const student = new studentModel({
                    _id: newAccount._id,
                    ...rest,
                    image: {
                        data: req.file.filename,
                        contentType: req.file.mimetype,
                    },
                });
                const newStudent = await student.save();
                res.status(200).json(newStudent);
            } else {
                res.json({ message: "not permited" });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
);

//get all student
adminRoutes.get("/student", verifyToken, async (req, res) => {
    try {
        if (req.user.role === "admin") {
            const students = await studentModel.find();
            res.status(200).json(students);
        } else {
            res.json({ message: "not permited" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//update student
adminRoutes.put(
    "/student/:id",
    verifyToken,
    upload.single("image"),
    async (req, res) => {
        try {
            if (req.user.role === "admin") {
                const studentId = req.params.id;
                const { _id, ...updateStudent } = req.body;
                const result = await studentModel.findByIdAndUpdate(
                    studentId,
                    {
                        $set: {
                            ...updateStudent,
                            image: req.file && {
                                data: req.file.filename,
                                contentType: req.file.mimetype,
                            },
                        },
                    },
                    { new: true }
                );
                res.send(result);
            } else {
                res.json({ message: "not permited" });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
);

//delete student
adminRoutes.delete("/student/:id", verifyToken, async (req, res) => {
    try {
        if (req.user.role === "admin") {
            const studentId = req.params.id;
            await accountModel.findByIdAndDelete(studentId);
            const result = await studentModel.findByIdAndDelete(studentId);
            res.send(result._id);
        } else {
            res.json({ message: "not permited" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// get classes
adminRoutes.get("/class", verifyToken, async (req, res) => {
    try {
        if (req.user.role === "admin") {
            const classes = await classModel.find();
            res.status(200).json(classes);
        } else {
            res.json({ message: "not permited" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//add new class
adminRoutes.post("/class", verifyToken, async (req, res) => {
    try {
        if (req.user.role === "admin") {
            if (!classModel.findOne({ className: req.body.className })) {
                const result = new classModel({
                    ...req.body,
                    numberOfStudent: 0,
                });
                const newClass = await result.save();
                res.status(200).json(newClass);
            }
            res.status({ message: "Class already existed!" });
        } else {
            res.json({ message: "not permited" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//update class
adminRoutes.put("/class/:id", verifyToken, async (req, res) => {
    try {
        if (req.user.role === "admin") {
            const classId = req.params.id;
            const result = await classModel.findByIdAndUpdate(
                classId,
                {
                    $set: {
                        ...req.body,
                    },
                },
                { new: true }
            );
            res.send(result);
        } else {
            res.json({ message: "not permited" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//delete class
adminRoutes.delete("/class/:id", verifyToken, async (req, res) => {
    try {
        if (req.user.role === "admin") {
            const classId = req.params.id;
            const result = await classModel.findByIdAndDelete(classId);
            res.send(result._id);
        } else {
            res.json({ message: "not permited" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = adminRoutes;
