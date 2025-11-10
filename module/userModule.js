const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: [true, "Please provide an Email!"],
        unique: [true, "Email already exist"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false,
    },
})
module.exports = mongoose.model("Users", UserSchema);