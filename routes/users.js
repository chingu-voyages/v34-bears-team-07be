const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// get all users
router.get("/", async (req, res) => {
  const users = await User.findAll();
  res.status(200).json(users);
});

// get one user
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json(user);
});

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  let user = { username, password, email };

  // Check to ensure all fields are populated
  for (const [key, value] of Object.entries(user)) {
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` },
      });
    }
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  user = new User({
    username,
    password: hashedPassword,
    email,
  });
  // Checks to see if the email is associated with another account
  const emailCheck = await User.findOne({ email });
  if (emailCheck) return res.status(400).json("Email is already in use");

  try {
    const newUser = await User.register(user);
    return res.status(201).json("User created.");
  } catch (e) {
    return res.status(e.status).json(e.message);
  }
});

//create a user
router.post("/", async (req, res) => {
  const { username, password, email } = req.body;

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = new User({
    username,
    password: hashedPassword,
    email,
  });

  try {
    const newUser = await user.save();
    res.status(201).json({ message: "User created." });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

//delete a user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await User.deleteUser(id);
    return res.json(msg);
  } catch (e) {
    return res.status(e.status).json(e.message);
  }
});

module.exports = router;
