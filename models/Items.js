const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemSchema = new Schema(
    {
        itemName: { type: String, default: "" },
        purchaseDate: { type: Date, default: new Date() },
        expirationDate: { type: Date },
        category: { type: String, default: "" },
        pictureLink: { type: String, default: "" },
    },
    { timeStamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
