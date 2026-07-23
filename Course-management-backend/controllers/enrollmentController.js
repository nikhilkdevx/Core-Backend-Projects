const Student = require("../Models/studentSchema");
const studentSchema = require("../validators/studentValidator");
const studentUpdateSchema = require("../validators/studentUpdateSchema");
const Course = require("../Models/courseSchema");
const courseSchema = require("../validators/courseValidator");
const courseUpdateSchema = require("../validators/courseUpdateSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.enrollment = async(req,res)=>{
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
    
}