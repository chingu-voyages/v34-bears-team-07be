const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/", (req, res) => {
    res.json("hello");
});

router.post("/", async (req, res) => {
    const { username, password, email } = req.body;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);
    // const user = new User({ username, hashedPassword, email });
    const user = new User({
        username,
        password,
        email,
    });
    // console.log("user", user);
    try {
        const newUser = await user.save();
        res.status(201).json({ message: "User created." });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

module.exports = router;
