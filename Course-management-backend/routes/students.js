const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const erollmentController = require("../controllers/enrollmentController");

router.get("/",studentController.index);

router.get("/:id",studentController.getOneStudent);

router.patch("/:id",studentController.updateStudent);

router.post("/",studentController.postStudent);

router.delete("/:id",studentController.deleteStudent);

router.post("/:id1/courses/:id2",erollmentController.enrollment);

module.exports = router;