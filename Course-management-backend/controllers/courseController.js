const Course = require("../Models/courseSchema");
const courseSchema = require("../validators/courseValidator");
const courseUpdateSchema = require("../validators/courseUpdateSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.postCourse = async(req,res)=>{
    const result = courseSchema.validate(req.body);
    if(result.error){
        return res.status(400).send(result.error.message);
    }
    const course = new Course(req.body);
    await course.save();
    res.status(201).send(course);  
}

module.exports.index = async(req,res)=>{
    const course = await Course.find({});
    res.status(200).send(course);
}

module.exports.getOneCourse = async(req,res)=>{
    const { id } = req.params;
    const course = await Course.findById(id).populate("students");
    if(!course){
        throw new ExpressError(404,"Course Not Found");
    }
    res.status(200).send(course);
}

module.exports.updateOneCourse = async(req,res)=>{
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
}

module.exports.deleteOneCourse = async(req,res)=>{
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if(!course){
        throw new ExpressError(404,"Course Not Found");
    }
    res.status(200).send({message : "deleted" ,course});
}