const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const mongoose = require("mongoose");
main()
.then(()=> console.log("Connected to MDB"))
.catch(err =>console.log("Error Happend",err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Course');

}

const User = require("./Models/userSchema");
const port = 9000;

app.listen(port,()=>{
    console.log("Listening to the port.");
});

const session = require("express-session");
app.use(session({
    secret : "mysecretkey",
    resave : false,
    saveUninitialized : false
}));

const passport = require("passport");
const localStrategy = require("passport-local");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(async(username,password,done)=>{
    const user = await User.findOne({username});
    if(!user){
        return done(null,false);
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return done(null,false);
    }
    return done(null,user);
}));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const studentRoutes = require("./routes/students");
const courseRoutes = require("./routes/courses");
const userRoutes = require("./routes/user");

app.use("/students",studentRoutes);
app.use("/courses",courseRoutes);
app.use("/users",userRoutes);

// Error Handling

app.use((err,req,res,next)=>{
    console.log("Global Error Handler");
    let {statusCode = 500 , message = "Something Went wrong"} = err;
    res.status(statusCode).send(message);
})
