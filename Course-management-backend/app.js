const express = require("express");
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const mongoose = require("mongoose");
main()
.then(()=> console.log("Connected to MDB"))
.catch(err =>console.log("Error Happend",err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Course');
}

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

const studentRoutes = require("./routes/students");
const courseRoutes = require("./routes/courses");

app.use("/students",studentRoutes);
app.use("/courses",courseRoutes);


// Error Handling

app.use((err,req,res,next)=>{
    console.log("Global Error Handler");
    let {statusCode = 500 , message = "Something Went wrong"} = err;
    res.status(statusCode).send(message);
})
