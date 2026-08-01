const Course = require("../Models/courseSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.isCourseOwner = async(req,res,next)=>{
    const {id} = req.paramas;
    const course = await Course.findById(id);
    if(!course){
        throw new ExpressError(404,"Course doesn't exist");
    }
    if(course.owner == req.user._id){
        next();
    } else{
        throw new ExpressError(403,"forbidden");
    }
}