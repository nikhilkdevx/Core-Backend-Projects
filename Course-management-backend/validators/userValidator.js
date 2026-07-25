const joi = require("joi");

const validateUser = joi.object({
    username : joi.string().unique().min(3).required(),
    password : joi.string().min(6).required(),
    email : joi.email(),
});

module.exports = validateUser;