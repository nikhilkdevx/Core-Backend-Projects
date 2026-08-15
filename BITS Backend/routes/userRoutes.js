const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyjwt = require("../middlewares/verifyJWT");
const allowRoles = require("../middlewares/allowRoles");
const isOwnerOrAdmin = require("../middlewares/isOwnerOrAdmin");

router.get("/",verifyjwt,allowRoles("professor","admin"),userController.getAllUsers);
router.route("/:id")
.get(verifyjwt,isOwnerOrAdmin,allowRoles("student"),userController.getOneUser)
.patch(verifyjwt,isOwnerOrAdmin,allowRoles("student"),userController.updateUser)
.delete(verifyjwt,allowRoles("admin"),userController.deleteUser);
