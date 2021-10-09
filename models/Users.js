const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        username: String,
        password: String,
        email: String,
        cart: { type: Array, default: [] },
        pantry: { type: Array, default: [] },
    },
    { timeStamps: true }
);

module.exports = mongoose.model("User", UserSchema);
