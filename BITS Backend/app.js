const express = require("express");
const app = express();

const port = 6000;
app.listen(port,()=>{
    console.log("app is listening");
});

const mongoose = require("mongoose");
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/bitsBackend");
}
main()
.then(()=>
    console.log("connected to MongoDB"))
.catch(err=>console.log(err));



