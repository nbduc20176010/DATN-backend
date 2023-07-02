const express = require("express");
const studentModel = require("../models/student");
const classModel = require("../models/class");
const scheduleModel = require("../models/schedule");
const requestModel = require("../models/request");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const studentRoutes = express.Router();

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
    return res.status(401).json({ message: "You are not authorized" });
  }
};

//get profile
studentRoutes.get("/profile", verifyToken, async (req, res) => {
  if (req.user.role) {
    const studentId = req.user.id;
    const profile = await studentModel.findById(studentId);
    return res.status(200).json(profile);
  } else {
    return res.status(401).json({ message: "No permition!" });
  }
});

//get schedule
studentRoutes.get("/schedule", verifyToken, async (req, res) => {
  if (req.user.role === "regular") {
    const studentId = req.user.id;
    const scheduleList = await scheduleModel.find();
    const classList = await classModel.find();
    const belongToClasses = classList.filter((item) =>
      item.students.find((student) => student._id === studentId)
    );
    const studentSchedule = scheduleList.map((item) => {
      return {
        label: item.label,
        classes: item.classes.filter((scheduleClass) =>
          Boolean(
            belongToClasses.find((belong) =>
              belong._id.equals(scheduleClass.classId)
            )
          )
        ),
      };
    });

    return res.status(200).json(studentSchedule);
  } else {
    res.status(401).json({ message: "not permited" });
  }
});

//get list classes
studentRoutes.get("/classes", verifyToken, async (req, res) => {
  if (req.user.role === "regular") {
    const studentId = req.user.id;
    const classList = await classModel.find();
    const filterClasses = classList.filter((item) =>
      item.students.find((student) => student._id === studentId)
    );
    const result = filterClasses.map((item) => {
      const student = item.students.find((student) => student._id === studentId);
      return {
        className: item.className,
        teacherName: item.teacher.fullName,
        midScore: student.midScore,
        finalScore: student.finalScore,
      };
    });
    return res.status(200).json(result);
  } else {
    return res.status(401).json({ message: "No permition!" });
  }
});

//get list request
studentRoutes.get("/requests", verifyToken, async (req, res) => {
  if (req.user.role === "regular") {
    const requestList = await requestModel.find({
      accountId: req.user.id,
    });
    return res.status(200).json(requestList);
  } else {
    res.status(401).json({ message: "not permited" });
  }
});

//create request
studentRoutes.post("/request", verifyToken, async (req, res) => {
  if (req.user.role === "regular") {
    const newRequest = new requestModel({
      status: "Pending",
      accountId: req.user.id,
      ...req.body,
    });
    await newRequest.save();
    return res.status(200).json({ message: "Create request successful!" });
  } else {
    res.status(401).json({ message: "not permited" });
  }
});

module.exports = studentRoutes;
