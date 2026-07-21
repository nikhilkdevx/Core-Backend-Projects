const joi = require("joi");

const studentSchema = joi.object({
    name : joi().string().required(),
    email : joi().string().email().required(),
    age : joi().number().min(16).required(),
    courses : joi().array().itmes(joi.string()).min(1).required()
});

module.exports = studentSchema;