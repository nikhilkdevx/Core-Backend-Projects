const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.route("/")
.get(courseController.getAllCourse)
.post(courseController.createCourse);

router.route("/:id")
.get(courseController.getOneCourse)
.patch(courseController.updateCourse)
.delete(courseController.DeletedCourse);



