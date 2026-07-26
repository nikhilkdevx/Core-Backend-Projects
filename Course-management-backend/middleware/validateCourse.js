const courseSchema = require("../validators/courseValidator");
const ExpressError = require("../utils/ExpressError");

function validateCourse(req,res,next){
    const result = courseSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error.message);
    }
}
module.exports = validateCourse;