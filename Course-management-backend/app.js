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
    const student = await Student.find({});
    res.send(student);

});

app.get("/students/:id",async(req,res)=>{
    const { id } = req.params;
    const student = await Student.findById(id).populate("courses");
    res.send(student);
});

app.patch("/students/:id",async(req,res)=>{
    const { id } = req.params;
    const newData = req.body;
    const student = await Student.findByIdAndUpdate(id,newData,{new : true});
    res.send(student);
});

app.post("/students",async (req,res)=>{
    console.log(req.body);
    const student =  new Student(req.body);
    await student.save();
    res.send(student);
});

app.delete("/students/:id",async(req,res)=>{
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    res.send({message : "deleted",student});

});

// Courses routes

app.post("/courses", async(req,res)=>{
    const course = new Course(req.body);
    await course.save();
    res.send(course); 
});

app.get("/courses" , async(req,res)=>{
    const course = await Course.find({});
    res.send(course);
});

app.get("/courses/:id",async(req,res)=>{
    const { id } = req.params;
    const course = await Course.findById(id).populate("students");
    res.send(course);
});

app.patch("/courses/:id",async(req,res)=>{
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id,req.body,{returnDocument : "after"});
    res.send(course);
});

app.delete("/courses/:id" , async(req,res)=>{
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    res.send({message : "deleted" ,course});
});

// Enroll student in course

app.post("/students/:id1/courses/:id2",async(req,res)=>{
    const { id1 } = req.params;
    const student = await Student.findById(id1);

    const { id2 } = req.params;
    const course = await Course.findById(id2);

    if(!student.courses.includes(course._id)){
       student.courses.push(course._id);
    }

    if(!course.students.includes(student._id)){
       course.students.push(student._id);
    } 
     
    await student.save();
    await course.save();

    res.send({ student,course });
});

