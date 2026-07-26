const studentUpdateSchema = require("../validators/studentUpdateSchema");
const ExpressError = require("../utils/ExpressError");

function validateStudent(req,res,next){
    const result = studentUpdateSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error.message);
    }
    next();
}

module.exports = validateStudent;

