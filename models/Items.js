import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    itemName: String,
    purchaseDate: { type: Date, default: Date.now },
    expirationDate: { type: Date },
    category: String,
    pictureLink: String,
  },
  { timeStamps: true }
);

module.exports = mongoose.model("User", UserSchema);
