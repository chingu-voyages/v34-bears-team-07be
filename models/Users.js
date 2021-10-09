import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    cart: Array,
    pantry: Array,
  },
  { timeStamps: true }
);

module.exports = mongoose.model("User", UserSchema);
