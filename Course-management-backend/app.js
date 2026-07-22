const express = require("express");
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const mongoose = require("mongoose");
main()
.then(()=> console.log("Connected to MDB"))
.catch(err =>console.log("Error Happend",err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Course');
}

const port = 9000;
app.listen(port,()=>{
    console.log("Listening to the port.");
});

const Student = require("./Models/studentSchema");
const Course = require("./Models/courseSchema");

const studentSchema = require("./validators/studentValidator");
const studentUpdateSchema = require("./validators/studentUpdateSchema");

const courseSchema = require("./validators/courseValidator");
const courseUpdateSchema = require("./validators/courseUpdateSchema");

const ExpressError = require("./utils/ExpressError");

// Student routes

app.get("/students",async (req,res)=>{
    const student = await Student.find({});
    res.status(200).send(student);
});

app.get("/students/:id",async(req,res)=>{
    const { id } = req.params;
    const student = await Student.findById(id).populate("courses");
    if(!student){
        throw new ExpressError(404,"Student Not Found");
    }
    res.status(200).send(student);    
});

app.patch("/students/:id",async(req,res)=>{
    const result = studentUpdateSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error.message);
    }
    const { id } = req.params;
    const newData = req.body;
    const student = await Student.findByIdAndUpdate(id,newData,{new : true});
    if(!student){
    throw new ExpressError(404,"Student Not Found");
    }
    res.status(200).send(student);
    
});

app.post("/students",async (req,res)=>{
    const result = studentSchema.validate(req.body);
    if(result.error){
        return res.status(400).send(result.error.message);
    }
    const student =  new Student(req.body);
    await student.save();
    res.status(201).send(student);
});

app.delete("/students/:id",async(req,res)=>{
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if(!student){
        throw new ExpressError(404,"Student Not Found");
    }
    res.status(200).send({message : "deleted",student});
});

// Courses routes

app.post("/courses", async(req,res)=>{
    const result = courseSchema.validate(req.body);
    if(result.error){
        return res.status(400).send(result.error.message);
    }
    const course = new Course(req.body);
    await course.save();
    res.status(201).send(course);  
});

app.get("/courses" , async(req,res)=>{
    const course = await Course.find({});
    res.status(200).send(course);
});

app.get("/courses/:id",async(req,res)=>{
    const { id } = req.params;
    const course = await Course.findById(id).populate("students");
    if(!course){
        throw new ExpressError(404,"Course Not Found");
    }
    res.status(200).send(course);
});

app.patch("/courses/:id",async(req,res)=>{
    const result = courseUpdateSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error.message);
    }
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id,req.body,{returnDocument : "after"});
    if(!course){
        throw new ExpressError(404,"Course Not Found");
    }
    res.status(200).send(course);
});

app.delete("/courses/:id" , async(req,res)=>{
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if(!course){
        throw new ExpressError(404,"Course Not Found");
    }
    res.status(200).send({message : "deleted" ,course});
});

// Enroll student in course

app.post("/students/:id1/courses/:id2",async(req,res)=>{
    const { id1 , id2 } = req.params;
    const student = await Student.findById(id1);
    const course = await Course.findById(id2);

    if(!student){
        throw new ExpressError(404,"Student Not Found");
    }
    if(!course){
        throw new ExpressError(404,"Student Not Found");
    }
    if(!student.courses.includes(course._id)){
        student.courses.push(course._id);
    }   
    if(!course.students.includes(student._id)){
       course.students.push(student._id);
    } 
    await student.save();
    await course.save();

    res.status(200).send({ student,course });
    
});

// Error Handling

app.use((err,req,res,next)=>{
    console.log("Global Error Handler");
    let {statusCode = 500 , message = "Something Went wrong"} = err;
    res.status(statusCode).send(message);
})
