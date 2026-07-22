const joi = require("joi");

const studentSchema = joi.object({
    name : joi.string().required(),
    email : joi.string().email().required(),
    age : joi.number().min(16).required(),
    courses : joi.array().items(joi.string()).min(1)
});

module.exports = studentSchema;