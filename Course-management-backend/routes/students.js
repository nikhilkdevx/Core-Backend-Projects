const express = require("express");
const router = express.Router();

const Student = require("../Models/studentSchema");
const studentSchema = require("../validators/studentValidator");
const studentUpdateSchema = require("../validators/studentUpdateSchema");
const ExpressError = require("../utils/ExpressError");

router.get("/",async (req,res)=>{
    const student = await Student.find({});
    res.status(200).send(student);
});

router.get("/:id",async(req,res)=>{
    const { id } = req.params;
    const student = await Student.findById(id).populate("courses");
    if(!student){
        throw new ExpressError(404,"Student Not Found");
    }
    res.status(200).send(student);    
});

router.patch("/:id",async(req,res)=>{
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

router.post("/",async (req,res)=>{
    const result = studentSchema.validate(req.body);
    if(result.error){
        return res.status(400).send(result.error.message);
    }
    const student =  new Student(req.body);
    await student.save();
    res.status(201).send(student);
});

router.delete("/:id",async(req,res)=>{
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if(!student){
        throw new ExpressError(404,"Student Not Found");
    }
    res.status(200).send({message : "deleted",student});
});

module.exports = router;