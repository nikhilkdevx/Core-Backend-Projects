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

const Course = require("./Models/courses");
const User = require("./Models/user");
const ExpressError = require("./utils/ExpressError");

const authRoutes = require("./routes/authRoutes");
app.use("/auth",authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/user",userRoutes);

const courseRoute = require("./routes/courseRoutes");
app.use("/course",courseRoute);

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