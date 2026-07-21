const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name : {
        type : String,
        required : true,

    },
    email : {
        type : String,
        required : true,


    },
    age : {
        type : Number,
        required : true,
        min : 16 , 
        
    },
    courses : [ 
        {
            type : Schema.Types.ObjectId,
            ref : "Course"
        }
    ]

});

const Student = mongoose.model("Student" , studentSchema);
module.exports = Student;