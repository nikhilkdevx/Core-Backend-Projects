const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const erollmentController = require("../controllers/enrollmentController");
const isLoggedIn = require("../middleware/auth");
const validateStudent = require("../middleware/validateStudent");

router.get("/",studentController.index);

router.get("/:id",isLoggedIn,studentController.getOneStudent);

router.patch("/:id",isLoggedIn,validateStudent,studentController.updateStudent);

router.post("/",isLoggedIn,validateStudent,studentController.postStudent);

router.delete("/:id",isLoggedIn,studentController.deleteStudent);

router.post("/:id1/courses/:id2",isLoggedIn,erollmentController.enrollment);

module.exports = router;