const mongoose = require("mongoose");
const { BadRequestError } = require("../expressError");
const { Schema } = mongoose;

const ItemSchema = new Schema({
  purchaseDate: {
    type: Date,
    default: new Date(),
  },
  expireDate: {
    type: Date,
    default: function () {
      let d = new Date();
      d.setDate(d.getDate() + 14);
      return d;
    },
  },
  itemName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "",
  },
  qty: {
    type: Number,
    default: 1,
  },
});

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (email) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: "Please enter a valid email.",
      },
      required: [true, "Email is required."],
    },
    cart: { type: Array, default: [] },
    // pantry: { type: Array, default: [] },
    pantry: { type: [ItemSchema], default: [] },
  },
  { timeStamps: true }
);

UserSchema.post("save", function (error, res, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new BadRequestError("This email address is already registered."));
  } else {
    next();
  }
});

module.exports = mongoose.model("User", UserSchema);
