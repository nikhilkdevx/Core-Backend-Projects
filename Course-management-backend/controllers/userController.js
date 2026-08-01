const User = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const validateUser = require("../validators/userValidator");
const ExpressError = require("../utils/ExpressError");

module.exports.register = async(req,res)=>{
    const result = validateUser.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error.message);
    }
    const {username , password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({
        username : username,
        email : email,
        password : hashedPassword,

    });
    await user.save();
    res.status(201).send("User Registered Successfully");
}

//Used Passport for it --->

// module.exports.login = async(req,res)=>{
//     const result = validateUser.validate(req.body);
//     if(result.error){
//         throw new ExpressError(400,result.error.message);
//     }
//     const {username,password} = req.body;
//     const user = await User.findOne({ username });
//     if(!user){
//         throw new ExpressError(400,"Invalid Username or Password");
//     }
//     const isMatch = await bcrypt.compare(password,user.password);
//     if(!isMatch){
//         throw new ExpressError(400,"Invalid Username or Password");
//     } 
//     req.session.user = user._id;
//     console.log(req.session.user);
//     res.status(200).send("Login Successful");
// }

