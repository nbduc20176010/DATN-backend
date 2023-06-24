const express = require("express");
const classModel = require("../models/class");
const scheduleModel = require("../models/schedule");
const requestModel = require("../models/request");

const jwt = require("jsonwebtoken");
const employeeModel = require("../models/employee");
require("dotenv").config();

const teacherRoute = express.Router();

//verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(403).json({ message: "Token is not valid!" });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

teacherRoute.get("/profile", verifyToken, async (req, res) => {
  if (req.user.role) {
    const teacherId = req.user.id;
    const profile = await employeeModel.findById(teacherId);
    return res.status(200).json(profile);
  } else {
    return res.status(401).json({ message: "No permition!" });
  }
});

teacherRoute.get("/classes", verifyToken, async (req, res) => {
  if (req.user.role === "teacher") {
    const teacherId = req.user.id;
    const teacher = await employeeModel.findById(teacherId);
    const results = await classModel.find({
      teacher: teacher,
    });
    return res.status(200).json(results);
  } else {
    return res.status(401).json({ message: "No permition!" });
  }
});

//update class
teacherRoute.put("/class/:id", verifyToken, async (req, res) => {
  if (req.user.role === "teacher") {
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
    res.status(200).json(result);
  } else {
    res.status(401).json({ message: "not permited" });
  }
});

//get schedule
teacherRoute.get("/schedule", verifyToken, async (req, res) => {
  if (req.user.role === "teacher") {
    const teacherId = req.user.id;
    const scheduleList = await scheduleModel.find();
    const teacherSchedule = scheduleList.map((item) => {
      return {
        label: item.label,
        classes: item.classes.filter(
          (scheduleClass) => scheduleClass.teacherId === teacherId
        ),
      };
    });

    return res.status(200).json(teacherSchedule);
  } else {
    res.status(401).json({ message: "not permited" });
  }
});

//create request
teacherRoute.post("/request", verifyToken, async (req, res) => {
  if (req.user.role === "teacher") {
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

//get list request
teacherRoute.get("/requests", verifyToken, async (req, res) => {
  if (req.user.role === "teacher") {
    const requestList = await requestModel.find({
      accountId: req.user.id,
    });
    return res.status(200).json(requestList);
  } else {
    res.status(401).json({ message: "not permited" });
  }
});

module.exports = teacherRoute;
