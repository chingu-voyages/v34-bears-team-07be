const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    itemName: String,
    purchaseDate: { type: Date, default: Date.now },
    expirationDate: { type: Date },
    category: String,
    pictureLink: String,
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
