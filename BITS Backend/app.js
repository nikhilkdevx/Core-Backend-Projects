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
const Course = require("./Models/courses");
const userValidation = require("./validators/userValidation");
const loginValidation = require("./validators/loginValidation");
const courseValidation = require("./validators/courseValidation");
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

app.get("/user",async (req,res)=>{
    const users = await User.find();
    const safeUsers = users.map((user)=> ({
        id : user._id,
        name : user.name,
        email : user.email,
        role : user.role,
    }));
    res.status(200).json({ users : safeUsers});
});

app.get("/user/:id",async(req,res)=>{
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

app.patch("/user/:id",async(req,res)=>{
    const { id } = req.params;
    const newuser = req.body;
    const updateduser = await User.findByIdAndUpdate(id,newuser,{returnDocument : 'after'});
    if(!updateduser){
        throw new ExpressError(404,"User not Found");
    }
    const safeUser = {
        id : updateduser._id,
        name : updateduser.name,
        email :updateduser.email,
        role : updateduser.role,
    }
    res.status(200).json({user : safeUser});
});

app.delete("/user/:id",async(req,res)=>{
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if(!user){
        throw new ExpressError(404,"User not Exist");
    }
    const safeUser = {
        id : user._id,
        name : user.name,
        email : user.email,
        role : user.role,
    }
    res.status(200).json({deletedUser : safeUser }); 
});

// Courses Route 
app.get("/course",async(req,res)=>{
    const courses = await Course.find();
    res.status(200).json({AllCourses : courses});
});

app.get("/course/:id",async(req,res)=>{
    const { id } = req.params;
    const course = await Course.findById(id);
    if(!course){
        throw new ExpressError(400,"Course Not Found");
    }
    res.status(200).json({course : course});
});

app.post("/course",async(req,res)=>{
    const result = courseValidation.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error.message);
    }
    const { name,code,credits} = req.body;
    const course = new Course({
        name,
        code,
        credits,
    });
    await course.save();
    res.status(201).json({message: "New Course Created ",course});
});

app.patch("/course/:id",async(req,res)=>{
    const newData = req.body;
    const {id} = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(id,newData,{ returnDocument: 'after'});
    if(!updatedCourse){
        throw new ExpressError(400,"Course Not Found");
    }
    res.status(200).json({message : " Course Updated Successfully",course : updatedCourse});
});

app.delete("/course/:id",async(req,res)=>{
    const {id} = req.params;
    const course = await Course.findByIdAndDelete(id);
    if(!course){
        throw new ExpressError(400,"Course Doesn't Exist");
    }
    res.status(200).json({DeletedCourse : course});
});

// Enrollemnt and Denrollemnt Routes 

app.patch("/user/:id1/course/:id2",async(req,res)=>{
    let { id1,id2 } = req.params;
    const student = await User.findById(id1);
    if(!student){
        throw new ExpressError(400,"Student Doesn't Exist");
    }
    const course = await Course.findById(id2);
    if(!course){
        throw new ExpressError(400,"Course Doesn't Exist");
    }
    if(!student.courses.includes(course._id)){
        student.courses.push(course._id);
    }
    if(!course.students.includes(student._id)){
        course.students.push(student._id);
    }
    await student.save();
    await course.save();
    const safeStudent = {
        id : student._id,
        name : student.name,
        email : student.email,
        role : student.role,
        courses : student.courses,
    };
    res.status(201).json({message : "Successfully Added",safeStudent});
});

app.delete("/user/:id1/course/:id2",async(req,res)=>{
    let { id1,id2 } = req.params;
    const student = await User.findById(id1);
    if(!student){
        throw new ExpressError(400,"Student Doesn't Exist");
    }
    const course = await Course.findById(id2);
    if(!course){
        throw new ExpressError(400,"Course Doesn't Exist");
    }
        student.courses.pull(course._id);
        course.students.pull(student._id);
    await student.save();
    await course.save();
    const safeStudent = {
        id : student._id,
        name : student.name,
        email : student.email,
        role : student.role,
        courses : student.courses,
    };
    res.status(201).json({message : "Successfully Removed from Course",safeStudent});
});

// Enroll Profs in Course

app.patch("/course/:id1/professor/:id2",async(req,res)=>{
    let { id1,id2 } = req.params;
    const course = await Course.findById(id1);
    if(!course){
        throw new ExpressError(400,"Course Doesn't Exist");
    }
    const professor = await User.findById(id2);
    if(!professor){
        throw new ExpressError(400,"Professor Doesn't Exist");
    }
    if(professor.role !== "professor"){
        throw new ExpressError(400,"User is not a professor");
    }
    if(!course.professor.includes(professor._id)){
        course.professor.push(professor._id);
    }
    await course.save();
    res.status(201).json({message : "Successfully Added",course});
});


// Global Error Handler
app.use((err,req,res,next)=>{
    const {statusCode = 500 , message = "Something Went Wrong"} = err;
    console.log("Global Error Handler");
    res.status(statusCode).json({message});
});