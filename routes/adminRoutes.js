const express = require("express");
const employeeModel = require("../models/employee");
const studentModel = require("../models/student");
const accountModel = require("../models/account");
const classModel = require("../models/class");
const requestModel = require("../models/request");
const scheduleModel = require("../models/schedule");

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
    cb(null, file.originalname);
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
        res.status(403).json({ message: "Token is not valid!" });
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
  if (req.user.role === "admin") {
    const employees = await employeeModel.find({ role: "teacher" });
    return res.status(200).json(employees);
  } else {
    return res.status(401).json({ message: "not permited" });
  }
});

//add new teacher
adminRoutes.post(
  "/teacher",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    if (req.user.role === "admin") {
      const existed = await accountModel.findOne({
        username: req.body.username,
      });
      if (existed) {
        return res.status(400).json({
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
      return res.status(200).json(newEmployee);
    } else {
      return res.status(401).json({ message: "not permited" });
    }
  }
);

//update teacher
adminRoutes.put(
  "/teacher/:id",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
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
      return res.status(200).json(result);
    } else {
      return res.status(401).json({ message: "not permited" });
    }
  }
);

//delete teacher
adminRoutes.delete("/teacher/:id", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const teacherId = req.params.id;
    await accountModel.findByIdAndDelete(teacherId);
    const resulst = await employeeModel.findByIdAndDelete(teacherId);
    return res.status(200).json({ id: resulst._id });
  } else {
    return res.status(401).json({ message: "not permited" });
  }
});

//add new student
adminRoutes.post(
  "/student",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    if (req.user.role === "admin") {
      const { username, password, ...rest } = req.body;
      const existed = await accountModel.findOne({
        username: req.body.username,
      });
      if (existed) {
        return res.status(400).json({
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
      return res.status(200).json(newStudent);
    } else {
      return res.json({ message: "not permited" });
    }
  }
);

//get all student
adminRoutes.get("/student", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const students = await studentModel.find();
    return res.status(200).json(students);
  } else {
    return res.status(401).json({ message: "not permited" });
  }
});

//update student
adminRoutes.put(
  "/student/:id",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
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
      return res.status(200).json(result);
    } else {
      return res.status(401).json({ message: "not permited" });
    }
  }
);

//delete student
adminRoutes.delete("/student/:id", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const studentId = req.params.id;
    await accountModel.findByIdAndDelete(studentId);
    const result = await studentModel.findByIdAndDelete(studentId);
    return res.status(200).json(result._id);
  } else {
    return res.status(401).json({ message: "not permited" });
  }
});

// get classes
adminRoutes.get("/class", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const classes = await classModel.find();
    return res.status(200).json(classes);
  } else {
    return res.json({ message: "not permited" });
  }
});

//add new class
adminRoutes.post("/class", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    if (!classModel.findOne({ className: req.body.className })) {
      const result = new classModel({
        ...req.body,
        numberOfStudent: 0,
      });
      const newClass = await result.save();
      return res.status(200).json(newClass);
    }
    return res.json({ message: "Class already existed!" });
  } else {
    return res.json({ message: "not permited" });
  }
});

//update class
adminRoutes.put("/class/:id", verifyToken, async (req, res) => {
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
    return res.send(result);
  } else {
    return res.json({ message: "not permited" });
  }
});

//delete class
adminRoutes.delete("/class/:id", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const classId = req.params.id;
    const result = await classModel.findByIdAndDelete(classId);
    return res.send(result._id);
  } else {
    return res.json({ message: "not permited" });
  }
});

//fetch requests
adminRoutes.get("/requests/:status", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const status = req.params.status;
    const results =
      status === "All"
        ? await requestModel.find()
        : await requestModel.find({
            status: status,
          });
    return res.json(results);
  } else {
    return res.status(401).json({ message: "not permited" });
  }
});

//fetch number of pending requests
adminRoutes.post("/requests/pending", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const pendingRequests = await requestModel.find({ status: "Pending" });
    return res.status(200).json({ numberOfRequests: pendingRequests.length });
  } else {
    return res.status(401).json({ message: "not permited" });
  }
});

//approval api
//delete student from class
adminRoutes.put("/approval/class/:id", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const requestId = req.params.id;
    const { studentId, classId } = req.body;
    const pendingRequest = await requestModel.findById(requestId);
    const studentClass = await classModel.findById(classId);
    const newStudentList = studentClass.students.filter(
      (item) => item._id !== studentId
    );
    studentClass.students = newStudentList;
    pendingRequest.status = "Approved";
    await pendingRequest.save();
    await studentClass.save();
    return res.send({ message: "Request approved!", request: pendingRequest });
  } else {
    return res.json({ message: "not permited" });
  }
});

//delete class from schedule
adminRoutes.put("/approval/schedule/:id", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const requestId = req.params.id;
    const { classId, ...schedule } = req.body;
    const pendingRequest = await requestModel.findById(requestId);
    const classSchedule = await scheduleModel.findOne({
      label: schedule.label,
    });
    const newClassesList = classSchedule.classes.filter(
      (item) => item._id.toString() !== classId
    );
    console.log(newClassesList);
    console.log(classSchedule);
    classSchedule.classes = newClassesList;
    pendingRequest.status = "Approved";
    await pendingRequest.save();
    await classSchedule.save();
    return res.send({ message: "Request approved!", request: pendingRequest });
  } else {
    return res.json({ message: "not permited" });
  }
});

//update profile teacher
adminRoutes.put("/approval/employee/:id", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const requestId = req.params.id;
    const { _id, ...updateTeacher } = req.body;
    const pendingRequest = await requestModel.findById(requestId);
    await employeeModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          ...updateTeacher,
        },
      },
      { new: true }
    );
    pendingRequest.status = "Approved";
    await pendingRequest.save();
    return res.send({ message: "Request approved!", request: pendingRequest });
  } else {
    return res.json({ message: "not permited" });
  }
});

//update profile student
adminRoutes.put("/approval/student/:id", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const requestId = req.params.id;
    const { _id, ...updateStudent } = req.body;
    const pendingRequest = await requestModel.findById(requestId);
    await studentModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          ...updateStudent,
        },
      },
      { new: true }
    );
    pendingRequest.status = "Approved";
    await pendingRequest.save();
    return res.send({ message: "Request approved!", request: pendingRequest });
  } else {
    return res.json({ message: "not permited" });
  }
});

//decline request
adminRoutes.put("/decline/:id", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const requestId = req.params.id;
    const pendingRequest = await requestModel.findById(requestId);
    pendingRequest.status = "Declined";
    await pendingRequest.save();
    return res.send({ message: "Request declined!", request: pendingRequest });
  } else {
    return res.json({ message: "not permited" });
  }
});

adminRoutes.put("/class/score/:id", verifyToken, async (req, res) => {
  if (req.user.role === "admin") {
    const { _id, midScore, finalScore } = req.body;
    const classId = req.params.id;
    const classDetail = await classModel.findById(classId);
    const studentIndex = classDetail.students.findIndex(
      (item) => item._id === _id
    );
    classDetail.students[studentIndex].midScore = midScore;
    classDetail.students[studentIndex].finalScore = finalScore;
    await classDetail.save()
    return res.status(200).send(classDetail);
  } else {
    return res.json({ message: "not permited" });
  }
});

module.exports = adminRoutes;
