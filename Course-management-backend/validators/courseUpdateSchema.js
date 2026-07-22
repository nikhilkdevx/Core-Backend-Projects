const joi = require("joi");

const courseUpdateSchema = joi.object({
    name : joi.string(),
    code : joi.number(),
    students : joi.array().items(joi.string()).min(1)
});

module.exports = courseUpdateSchema;