const express = require("express");
const classModel = require("../models/class");

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

teacherRoute.get("/classes", verifyToken, async (req, res) => {
  if (req.user.role === "teacher") {
    const teacherId = req.user.id;
    const teacher = await employeeModel.findById(teacherId);
    const results = await classModel.find({
      teacher: teacher,
    });
    return res.status(200).json(results);
  } else {
    return res.status(401).json({ message: "No permisiong!" });
  }
});

module.exports = teacherRoute;
