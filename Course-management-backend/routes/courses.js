const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const isLoggedIn = require("../middleware/auth");
const validateCourse = require("../middleware/validateCourse");
const verifyJwT = require("../middleware/verifyJWT");

router.post("/",isLoggedIn,validateCourse,courseController.postCourse);

router.get("/" ,verifyJwT,courseController.index);

router.get("/:id",isLoggedIn,courseController.getOneCourse);

router.patch("/:id",isLoggedIn,courseController.updateOneCourse);

router.delete("/:id" ,isLoggedIn,courseController.deleteOneCourse);

module.exports = router;