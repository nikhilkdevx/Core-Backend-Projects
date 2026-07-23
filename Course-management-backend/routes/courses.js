const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.post("/",courseController.postCourse);

router.get("/" ,courseController.index);

router.get("/:id",courseController.getOneCourse);

router.patch("/:id",courseController.updateOneCourse);

router.delete("/:id" ,courseController.deleteOneCourse);

module.exports = router;