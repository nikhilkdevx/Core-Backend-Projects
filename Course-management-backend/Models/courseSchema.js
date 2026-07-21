const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name : {
        type : String,

    },
    code : {
        type : Number,
    },
    students : [
        {
            type : Schema.Types.ObjectId,
            ref : "Student",
        }
    ]

});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
