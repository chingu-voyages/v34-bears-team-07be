const mongoose = require("mongoose");
const User = require("./models/Users");
const dontenv = require("dotenv");
require("dotenv").config();

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas");
    seedDB().then(() => {
      mongoose.connection.close();
    });
  })
  .catch((err) => {
    console.log(err);
  });

const seedUsers = [
  {
    username: "Test1",
    password: "password",
    email: "test1@test.com",
    cart: [],
    // Person has Orange Juice and Milk
    pantry: ["61661ee07aca7fab656fe6c3", "61661ee07aca7fab656fe6c4"],
  },
  {
    username: "Test2",
    password: "password",
    email: "test2@test.com",
    // Person wants to buy chicken
    cart: ["61661ee07aca7fab656fe6c5"],
    // Person has beef
    pantry: ["61661ee07aca7fab656fe6c6"],
  },
  {
    username: "Test3",
    password: "password",
    email: "test3@test.com",
    cart: [],
    pantry: [],
  },
  {
    username: "Test4",
    password: "password",
    email: "test4@test.com",
    // Person wants to buy coffee
    cart: ["61661ee07aca7fab656fe6c9"],
    pantry: [],
  },
  {
    username: "Test5",
    password: "password",
    email: "test5@test.com",
    // Person wants to make lasagna, needs pasta tomato paste, crushed tomato, and basil leaves
    cart: [
      "61661ee07aca7fab656fe6cb",
      "61661ee07aca7fab656fe6cc",
      "61661ee07aca7fab656fe6cd",
      "61661ee07aca7fab656fe6ce",
    ],
    // Person has Mozzarella
    pantry: ["61661ee07aca7fab656fe6ca"],
  },
];

const seedDB = async () => {
  await User.deleteMany({});
  console.log("Deleted all items in Users collection");
  await User.insertMany(seedUsers);
  console.log("Seeded Users collection");
};
