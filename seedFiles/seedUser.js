const mongoose = require("mongoose");
const User = require("./../models/Users");
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
    pantry: [
      {
        itemId: "61661ee07aca7fab656fe6c3",
        quantity: 1,
        inFreezer: false,
      },
      {
        itemId: "61661ee07aca7fab656fe6c4",
        quantity: 1,
        inFreezer: false,
      },
    ],
  },
  {
    username: "Test2",
    password: "password",
    email: "test2@test.com",
    // Person wants to buy chicken
    cart: [
      {
        itemId: "61661ee07aca7fab656fe6c5",
        quantity: 1,
      },
    ],
    // Person has beef
    pantry: [
      {
        itemId: "61661ee07aca7fab656fe6c6",
        quantity: 1,
        inFreezer: true,
      },
    ],
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
    cart: [
      {
        itemId: "61661ee07aca7fab656fe6c9",
        quantity: 1,
      },
    ],
    pantry: [],
  },
  {
    username: "Test5",
    password: "password",
    email: "test5@test.com",
    // Person wants to make lasagna, needs pasta tomato paste, crushed tomato, and basil leaves
    cart: [
      {
        itemId: "61661ee07aca7fab656fe6cb",
        quantity: 1,
      },
      {
        itemId: "61661ee07aca7fab656fe6cc",
        quantity: 1,
      },
      {
        itemId: "61661ee07aca7fab656fe6cd",
        quantity: 1,
      },
      {
        itemId: "61661ee07aca7fab656fe6ce",
        quantity: 1,
      },
    ],
    // Person has Mozzarella
    pantry: [
      {
        itemId: "61661ee07aca7fab656fe6ca",
        quantity: 1,
        inFreezer: true,
      },
    ],
  },
];

const seedDB = async () => {
  await User.deleteMany({});
  console.log("Deleted all items in Users collection");
  await User.insertMany(seedUsers);
  console.log("Seeded Users collection");
};
