const { default: mongoose } = require("mongoose");

const { Schema } = mongoose;

const instaSChema = new Schema({
    username: String,
    password: String,
    followers : Number,
    following : Number,
});

const Insta = mongoose.model("Insta", instaSChema);

module.exports = Insta;