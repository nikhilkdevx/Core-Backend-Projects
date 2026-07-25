const User = require("../Models/userSchema");
const express = require("express");
const bcrypt = require("bcrypt");
const validateUser = require("../validators/userValidator");
const ExpressError = require("../utils/ExpressError");
const session = require("express-session");

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

module.exports.register = async(req,res)=>{
    const result = validateUser(req.body);
    if(result.error){
        throw new ExpressError(400,result.error.message);
    }
    const {username , password } = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({
        username : username,
        password : hashedPassword,
    });
    await user.save();
    res.status(201).send("User Registered Successfully");
}

module.exports.login = async(req,res)=>{
    const result = validateUser(req.body);
    if(result.error){
        throw new ExpressError(400,result.error.message);
    }
    const {username,password} = req.body;
    const user = await User.findOne({ username });
    if(!user){
        throw new ExpressError(400,"Invalid Username or Password");
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new ExpressError(400,"Invalid Username or Password");
    } 
    req.session.user = user._id;
    res.status(200).send("Login Successful");
}