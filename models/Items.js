const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    name: { type: String, default: "" },
    category: { type: String, default: "" },
    expirationDays: { type: Number, default: 0 },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
