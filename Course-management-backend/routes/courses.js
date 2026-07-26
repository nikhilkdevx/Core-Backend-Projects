const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const isLoggedIn = require("../middleware/auth");
const validateCourse = require("../middleware/validateCourse");

router.post("/",isLoggedIn,validateCourse,courseController.postCourse);

router.get("/" ,courseController.index);

router.get("/:id",isLoggedIn,courseController.getOneCourse);

router.patch("/:id",isLoggedIn,courseController.updateOneCourse);

router.delete("/:id" ,isLoggedIn,courseController.deleteOneCourse);

module.exports = router;