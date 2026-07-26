const joi = require("joi");

const validateUser = joi.object({
    username : joi.string().min(3).required(),
    password : joi.string().min(6).required(),
    email : joi.string().email(),
});

module.exports = validateUser;