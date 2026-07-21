const joi = require("joi");

const studentUpdateSchema = joi.object({
    name : joi().string(),
    email : joi().string().email(),
    age : joi().number().min(16),
    courses : joi().array().itmes(joi.string()).min(1)
});

module.exports = studentUpdateSchema;