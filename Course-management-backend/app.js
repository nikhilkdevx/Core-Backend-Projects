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

const Student = require("./Schema/studentSchema");
const Course = require("./Schema/courseSchema");

// Student routes

app.get("/students",async (req,res)=>{
    try{
        const student = await Student.find({});
        res.status(200).send(student);

    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    

});

app.get("/students/:id",async(req,res)=>{
    try{
        const { id } = req.params;
        const student = await Student.findById(id).populate("courses");
        if(!student){
            return res.status(404).send("Student Not Found");
        }
        res.status(200).send(student);    
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

app.patch("/students/:id",async(req,res)=>{
    try{
        const { id } = req.params;
        const newData = req.body;
        const student = await Student.findByIdAndUpdate(id,newData,{new : true});
        if(!student){
        return res.status(404).send("Student Not Found");
        }
        res.status(200).send(student);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    
});

app.post("/students",async (req,res)=>{
    try{
        const student =  new Student(req.body);
        await student.save();
        res.status(201).send(student);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    
});

app.delete("/students/:id",async(req,res)=>{
    try{
        const { id } = req.params;
        const student = await Student.findByIdAndDelete(id);
        if(!student){
        return res.status(404).send("Student Not Found");
        }
        res.status(200).send({message : "deleted",student});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

// Courses routes

app.post("/courses", async(req,res)=>{
    try{
        const course = new Course(req.body);
        await course.save();
        res.status(201).send(course); 
    } catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    
});

app.get("/courses" , async(req,res)=>{
    try{
        const course = await Course.find({});
        res.status(200).send(course);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    
});

app.get("/courses/:id",async(req,res)=>{
    try{
        const { id } = req.params;
        const course = await Course.findById(id).populate("students");
        if(!course){
            return res.status(404).send("Course Not Found");
        }
        res.status(200).send(course);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

app.patch("/courses/:id",async(req,res)=>{
    try{
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id,req.body,{returnDocument : "after"});
    if(!course){
        return res.status(404).send("Course Not Found");
    }
    res.status(200).send(course);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    
});

app.delete("/courses/:id" , async(req,res)=>{
    try{
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if(!course){
        return res.status(404).send("Course Not Found");
    }
    res.status(200).send({message : "deleted" ,course});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
   
});

// Enroll student in course

app.post("/students/:id1/courses/:id2",async(req,res)=>{
    try{
    const { id1 } = req.params;
    const student = await Student.findById(id1);
    console.log(student);

    const { id2 } = req.params;
    const course = await Course.findById(id2);

    if(!student){
        res.send("Student not Found");
        return;
    }
    if(!course){
        res.send("Course not Found");
        return;
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
    }
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
    
});

