const mongoose = require("mongoose");
const { Schema } = mongoose;
const { NotFoundError } = require("../expressError");

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

UserSchema.statics.findAll = function () {
    return this.find();
};

UserSchema.statics.findById = async function (id) {
    let user = await this.findOne({ _id: id });
    if (!user) throw new NotFoundError("User not found!");
    return user;
};

UserSchema.statics.deleteUser = async function (id) {
    let user = await this.findById(id);
    user.remove();
    return { message: "User deleted." };
};

UserSchema.statics.register = async function ({ username, password, email }) {
    const duplicateUser = await this.findOne({ username: username });
};

module.exports = mongoose.model("User", UserSchema);
