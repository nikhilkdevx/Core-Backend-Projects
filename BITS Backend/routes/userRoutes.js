const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/",userController.getAllUsers);
router.route("/:id")
.get(userController.getOneUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);
