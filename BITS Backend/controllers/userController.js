const User = require("./Models/user");
const updateUserValidation = require("../validators/updateUserValidation");
const ExpressError = require("../utils/ExpressError");

module.exports.getAllUsers = async (req,res)=>{
    const users = await User.find();
    const safeUsers = users.map((user)=> ({
        id : user._id,
        name : user.name,
        email : user.email,
        role : user.role,
    }));
    res.status(200).json({ users : safeUsers});
};

module.exports.getOneUser = async(req,res)=>{
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user){
        throw new ExpressError("404","User not found");
    }
    const safeUser = {
        id : user._id,
        name : user.name,
        email : user.email,
        role : user.role,
    }
    res.status(200).json({user: safeUser});
};

module.exports.updateUser = async(req,res)=>{
    const result =  updateUserValidation.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error.message);
    } 
    const { id } = req.params;
    const newuser = req.body;
    const updateduser = await User.findByIdAndUpdate(id,newuser,{returnDocument : 'after'});
    if(!updateduser){
        throw new ExpressError(404,"User not Found");
    }
    const safeUser = {
        id : updateduser._id,
        name : updateduser.name,
        email :updateduser.email,
        role : updateduser.role,
    }
    res.status(200).json({user : safeUser});
};

module.exports.deleteUser = async(req,res)=>{
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if(!user){
        throw new ExpressError(404,"User not Exist");
    }
    const safeUser = {
        id : user._id,
        name : user.name,
        email : user.email,
        role : user.role,
    }
    res.status(200).json({deletedUser : safeUser }); 
};