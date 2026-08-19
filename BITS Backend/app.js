const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

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

const Course = require("./Models/courses");
const User = require("./Models/user");
const ExpressError = require("./utils/ExpressError");

const authRoutes = require("./routes/authRoutes");
app.use("/auth",authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/user",userRoutes);

const courseRoute = require("./routes/courseRoutes");
app.use("/course",courseRoute);

// Global Error Handler
app.use((err,req,res,next)=>{
    const {statusCode = 500 , message = "Something Went Wrong"} = err;
    res.status(statusCode).json({message});
});