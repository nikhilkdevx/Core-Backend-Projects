const joi = require("joi");

const courseSchema = joi.object({
    name : joi.string().required(),
    code : joi.number().required(),
    students : joi.array().items(joi.string()).min(1).required()
});

module.exports = courseSchema;