const mongoose = require("mongoose");
const { Schema } = mongoose;
const { NotFoundError, UnauthorizedError } = require("../expressError");
const bcrypt = require("bcrypt");

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
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                        email
                    );
                },
                message: "Please enter a valid email.",
            },
            required: [true, "Email is required."],
        },
        cart: { type: Array, default: [] },
        pantry: { type: Array, default: [] },
    },
    { timeStamps: true }
);

UserSchema.statics.authenticate = async function (email, password) {
    const user = await this.findOne({ email: email });
    if (user) {
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            delete user.password;
            return user;
        }
    }
    throw new UnauthorizedError("Invalid username/password");
};

UserSchema.path("email").validate(async (value) => {
    const emailCount = await mongoose.models.User.countDocuments({
        email: value,
    });
    return !emailCount;
}, "This email address is already registered");

module.exports = mongoose.model("User", UserSchema);
