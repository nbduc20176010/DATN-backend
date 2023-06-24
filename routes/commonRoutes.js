const express = require("express");
const accountModel = require("../models/account");
const studentModel = require("../models/student");
const classModel = require("../models/class");
const roomModel = require("../models/room");
const employeeModel = require("../models/employee");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const commonRoutes = express.Router();

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

//login api
commonRoutes.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await accountModel.findOne({
    username: username,
  });
  if (user) {
    if (user.password !== password) {
      res.status(401).json({ message: "wrong password!" });
    } else {
      const accessToken = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.SECRET_KEY
      );
      res.json({
        username: user.username,
        role: user.role,
        accessToken,
      });
    }
  } else {
    res.status(401).json({ message: "can't find user!" });
  }
});

//signup api
commonRoutes.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const usernameCheck = await accountModel.findOne({
    username: username,
  });
  if (!usernameCheck) {
    const newUser = new accountModel({
      username: username,
      password: password,
      role: "regular",
    });
    try {
      const savedUser = await newUser.save();
      const userProfile = new studentModel({
        _id: savedUser._id,
      });
      await userProfile.save();
      res.status(200).json({ message: "signup success" });
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res.status(400).json({
      message: "username already taken!",
    });
  }
});

//logout api
commonRoutes.post("/logout", verifyToken, async (req, res) => {
  res.status(200).json({ message: "You logged out!" });
});

//get class detail
commonRoutes.get("/class/:id", async (req, res) => {
  try {
    const classDetail = await classModel.findOne({
      _id: req.params.id,
    });
    if (classDetail) {
      res.status(200).json(classDetail);
    } else {
      res.status(404).json({ message: "can't find class!" });
    }
  } catch (err) {
    res.json(err);
  }
});

commonRoutes.get("/room", async (req, res) => {
  try {
    const rooms = await roomModel.find();
    if (rooms) {
      res.status(200).json(rooms);
    } else {
      res.status(404).json({ message: "can't find room!" });
    }
  } catch (err) {
    res.json(err);
  }
});

commonRoutes.get("/profile/employee", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await employeeModel.findById(userId);
    return res.json(profile);
  } catch (error) {
    res.json(error);
  }
});

commonRoutes.get("/profile/student/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await studentModel.findById(userId);
    return res.json(profile);
  } catch (error) {
    res.json(error);
  }
});

module.exports = commonRoutes;
