const express = require("express");
const app = express();
require("dotenv").config();

const port = 6000;
app.listen(port,()=>{
    console.log("app is listening");
});

app.use(express.json());

const mongoose = require("mongoose");
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/bitsBackend");
}
main()
.then(()=>
    console.log("connected to MongoDB"))
.catch(err=>console.log(err));

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./Models/user");
const userValidation = require("./validators/userValidation");
const loginValidation = require("./validators/loginValidation");
const ExpressError = require("./utils/ExpressError");

// Auth 
app.post("/auth/register",async (req,res)=>{
    const result = userValidation.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error.message);
    }
    const {name,email,password,role} = req.body;
    const existingUser = await User.findOne({ email });
    if(existingUser){
        throw new ExpressError(409,"Email already Registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        email,
        password : hashedPassword,
        role,
    });
    await user.save();
    const safeUser = {
        id : user._id,
        name : user.name,
        email : user.email,
        role : user.role
    };
    res.status(201).json({message : " User registered Successfully", user : safeUser});
    
});

app.post("/auth/login",async(req,res)=>{
    const result = loginValidation.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error.message);
    }
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw new ExpressError(401,"Invalid Email or Password");
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new ExpressError(401,"Invalid Email or Password");
    }
    const token = jwt.sign({
        userId : user._id , role : user.role},
        process.env.JWT_SECERT,
        {expiresIn : "7d"}
    );
    const safeUser = {
        id : user._id,
        name : user.name,
        email : user.email,
        role : user.role
    };
    res.status(200).json({message : "Login Success", token, user : safeUser});
});

// user Routes

app.get("/users",async (req,res)=>{
    const users = await User.find();
    const safeUsers = users.map((user)=> ({
        id : user._id,
        name : user.name,
        email : user.email,
        role : user.role,
    }));
    res.status(200).json({ users : safeUsers});
});

app.get("/users/:id",async(req,res)=>{
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user){
        throw new ExpressError("404","User not found");
    }
    const safeUser = {
        id : user._id,
        name : user.name,
        email : user.email,
        role : user.role,
    }
    res.status(200).json({user: safeUser});
});


app.use((err,req,res,next)=>{
    const {statusCode = 500 , message = "Something Went Wrong"} = err;
    res.status(statusCode).json({message});
});