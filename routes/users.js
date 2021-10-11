const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const { createToken } = require("../auth/tokens");
const { BadRequestError } = require("../expressError");

// get all users: => all users info
router.get("/", async (req, res) => {
    const users = await User.findAll();
    res.status(200).json(users);
});

// get one user: _id => this user info
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
});

// user registration: username, password & email => token
router.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        // check if password is null
        if (!password) throw new BadRequestError("Password is requred.");
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email });
        await user.save();
        const token = createToken(user);
        console.log("token", token);
        return res.status(201).json({ token });
    } catch (e) {
        if (e.name === "ValidationError") {
            let errors = {};
            Object.keys(e.errors).forEach((key) => {
                errors[key] = e.errors[key].message;
            });
            return res.status(400).json({ error: errors });
        }
        return res.status(e.status || 400).json({ error: e.message });
    }
});

// user login: email & password => token
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw new BadRequestError("Username and password are required.");
        const user = await User.authenticate(email, password);
        const token = createToken(user);
        return res.json({ token });
    } catch (e) {
        return res.status(e.status).json({ error: e.message });
    }
});

// delete a user: _id => deleted
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const msg = await User.deleteUser(id);
        return res.json(msg);
    } catch (e) {
        return res.status(e.status).json({ error: e.message });
    }
});

module.exports = router;
