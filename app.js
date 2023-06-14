const express = require("express");
const mongoose = require("mongoose");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");
const commonRoutes = require("./routes/commonRoutes");
const scheduleRoute = require("./routes/scheduleRoute");
const teacherRoute = require("./routes/teacherRoutes")
require("dotenv").config();

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
    console.log(error);
});
database.once("connected", () => {
    console.log("Database Connected");
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/schedule", scheduleRoute);
app.use("/api/teacher", teacherRoute);
app.use("/api", commonRoutes);
app.use(express.static("uploads"));

app.listen(5000, () => {
    console.log(`Server Started at ${5000}`);
});
