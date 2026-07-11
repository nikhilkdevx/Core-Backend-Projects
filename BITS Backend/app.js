const express = require("express");
const app = express();
let Insta = require("./data");

app.get("/insta/:id",async (req,res)=>{
    let id = req.params.id;
    let inst = insta.findbyId(id);
    res.render("dummyejsfile",{insta});
});

listing.find($and[
    {price : {$gte : 1000}},
    {price : {$lte : 5000}}
]);