const express = require("express");
const scheduleModel = require("../models/schedule");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const scheduleRoute = express.Router();

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

scheduleRoute.get("/", async (req, res) => {
  const results = await scheduleModel.find();
  return res.json(results);
});

scheduleRoute.put("/", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const { label, ...rest } = req.body;
    const weekdays = await scheduleModel.findOne({ label: label });
    if (weekdays.classes.find((item) => item.shift === rest.shift)) {
      if (weekdays.classes.find((item) => item.room === rest.room)) {
        return res.status(400).send({ message: "This room is taken!" });
      }
      if (weekdays.classes.find((item) => item.class === rest.class)) {
        return res
          .status(400)
          .send({ message: "This class is already takeplaced" });
      }
      if (weekdays.classes.find((item) => item.teacherId === rest.teacherId)) {
        return res.status(400).send({ message: "This teacher is busy!" });
      }
    }
    weekdays.classes.push(rest);
    await weekdays.save();
    return res.json(weekdays);
  } else {
    return res.status(401).json({ message: "not permited" });
  }
});

scheduleRoute.post("/:id", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const weekdays = await scheduleModel.findOne({ _id: req.params.id });
    weekdays.classes = req.body;
    await weekdays.save();
    return res.json(weekdays);
  } else {
    return res.status(401).json({ message: "not permited" });
  }
});

module.exports = scheduleRoute;
