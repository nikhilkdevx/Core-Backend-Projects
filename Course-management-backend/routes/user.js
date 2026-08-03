const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");

router.post("/register",userController.register);
router.post("/login",
    // normal login
    userController.login
    
    //passport method
    // passport.authenticate("local"),
    // (req,res) =>{
    //     res.send("login Success!!");
    // }
);

module.exports = router;