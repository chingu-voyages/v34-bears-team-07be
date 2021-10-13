const mongoose = require("mongoose");
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const { createToken } = require("../auth/tokens");
const {
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
} = require("../expressError");

exports.findAll = async function (req, res) {
    try {
        const users = await User.find();
        if (!users) throw new NotFoundError("No users found.");
        return res.status(200).json({ users });
    } catch (e) {
        return res.status(e.status).json(e.message);
    }
};

exports.findOne = async function (req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new BadRequestError("Invalid id.");
        let user = await User.findById(id);
        if (!user) throw new NotFoundError("User not found.");
        return res.status(200).json({ user });
    } catch (e) {
        return res.status(e.status).json(e.message);
    }
};

exports.register = async function (req, res) {
    try {
        const { username, password, email } = req.body;
        // check if password is null
        if (!password) throw new BadRequestError("Password is required.");
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email });
        await user.save();
        const token = createToken(user);
        return res.status(201).json({ token });
    } catch (e) {
        if (e.name === "ValidationError") {
            let errors = {};
            Object.keys(e.errors).forEach((key) => {
                errors[key] = e.errors[key].message;
            });
            return res.status(400).json({ error: errors });
        }
        return res.status(e.status).json({ error: e.message });
    }
};

exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw new BadRequestError("Email and password are required.");
        const user = await User.findOne({ email: email });
        if (!user) throw new BadRequestError("User not found.");
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            const token = createToken(user);
            return res.json({ token });
        } else {
            throw new UnauthorizedError("Invalid username/password");
        }
    } catch (e) {
        return res.status(e.status).json({ error: e.message });
    }
};

exports.update = async function (req, res) {
    try {
        const { id } = req.params;
        let updateInfo = { ...req.body };
        if (updateInfo.password) {
            updateInfo.password = await bcrypt.hash(updateInfo.password, 10);
        }
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new BadRequestError("Invalid id.");
        const updatedUser = await User.findByIdAndUpdate(id, updateInfo, {
            new: true,
        });
        if (!updatedUser) throw new NotFoundError("User not found.");
        let returnUser = updatedUser.toObject();
        delete returnUser.password;
        return res.status(200).json({ user: returnUser });
    } catch (e) {
        if (e.name === "ValidationError") {
            let errors = {};
            Object.keys(e.errors).forEach((key) => {
                errors[key] = e.errors[key].message;
            });
            return res.status(400).json({ error: errors });
        }
        return res.status(e.status).json(e.message);
    }
};

exports.delete = async function (req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new BadRequestError("Invalid id.");
        let user = await User.findById(id);
        if (!user) throw new NotFoundError("User not found.");
        user.remove();
        return res.status(202).json({ message: "User deleted." });
    } catch (e) {
        return res.status(e.status).json({ error: e.message });
    }
};
