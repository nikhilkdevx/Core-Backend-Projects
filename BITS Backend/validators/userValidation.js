const joi = require("joi");

const userValidation = joi.object({
    name : joi.string().min(4).required(),
    email : joi.string().email().required(),
    password : joi.string().min(6).required(),
    role : joi.string()
    .valid("student","professor","admin")
    .required()
});

module.exports = userValidation;