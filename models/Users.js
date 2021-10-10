const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, default: "" },
    password: { type: String, default: "" },
    email: { type: String, default: "" },
    cart: { type: Array, default: [] },
    pantry: { type: Array, default: [] },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("User", UserSchema);
