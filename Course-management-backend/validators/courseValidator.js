const joi = require("joi");

const courseSchema = Joi.object({
    name : Joi.string().required(),
    code : Joi.number().required(),
    students : Joi.array().items(Joi.string()).min(1).required()
});

module.exports = courseSchema;