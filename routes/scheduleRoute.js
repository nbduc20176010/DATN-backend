const express = require("express");
const scheduleModel = require("../models/schedule");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const scheduleRoute = express.Router();

scheduleRoute.get("/", async (req, res) => {
    const results = await scheduleModel.find();
    return res.json(results);
});

scheduleRoute.post("/", async (req, res) => {
    console.log(req.body);
    const newSchedule = new scheduleModel({
        ...req.body,
    });
    const results = await newSchedule.save(newSchedule);
    return res.json(results);
});

module.exports = scheduleRoute;
