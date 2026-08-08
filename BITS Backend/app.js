const express = require("express");
const app = express();

const port = 6000;
app.listen(port,()=>{
    console.log("app is listening");
});

app.use(express.json());

const mongoose = require("mongoose");
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/bitsBackend");
}
main()
.then(()=>
    console.log("connected to MongoDB"))
.catch(err=>console.log(err));

const bcrypt = require("bcrypt");
const User = require("./Models/user");
const userValidation = require("./validators/userValidation");
const ExpressError = require("./utils/ExpressError");

// Auth 
app.post("/auth/register",async (req,res)=>{
    const result = userValidation.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400,result.error.message);
        return;
    }
    const {name,email,password,role} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        email,
        password : hashedPassword,
        role,
    });
    await user.save();
    res.status(201).json({message : " User registered Successfully"});
    
});






app.use((err,req,res,next)=>{
    const {statusCode = 500 , message = "Something Went Wrong"} = err;
    res.status(statusCode).json({message});
});