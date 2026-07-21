const joi = require("joi");

const courseUpdateSchema = Joi.object({
    name : Joi.string(),
    code : Joi.number(),
    students : Joi.array().items(Joi.string()).min(1)
});

module.exports = courseUpdateSchema;