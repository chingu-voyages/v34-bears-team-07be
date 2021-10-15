const mongoose = require("mongoose");
const Item = require("./../models/Items");
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

const seedItems = [
  {
    itemName: "Orange Juice",
    purchaseDate: "2021-10-12T20:38:27.637+00:00",
    expirationDate: "2021-10-30T20:38:27.637+00:00",
    category: "Juice",
    pictureLink: "",
  },
  {
    itemName: "Milk",
    purchaseDate: "2021-10-12T20:38:27.637+00:00",
    expirationDate: "2021-10-30T20:38:27.637+00:00",
    category: "Produce",
    pictureLink: "",
  },
  {
    itemName: "Chicken",
    purchaseDate: "2021-10-12T20:38:27.637+00:00",
    expirationDate: "2021-10-30T20:38:27.637+00:00",
    category: "Meat",
    pictureLink: "",
  },
  {
    itemName: "Beef",
    purchaseDate: "2021-10-12T20:38:27.637+00:00",
    expirationDate: "2021-10-30T20:38:27.637+00:00",
    category: "Meat",
    pictureLink: "",
  },
  {
    itemName: "Pork",
    purchaseDate: "2021-10-12T20:38:27.637+00:00",
    expirationDate: "2021-10-30T20:38:27.637+00:00",
    category: "Meat",
    pictureLink: "",
  },
  {
    itemName: "Eggs",
    purchaseDate: "2021-10-12T20:38:27.637+00:00",
    expirationDate: "2021-10-30T20:38:27.637+00:00",
    category: "Produce",
    pictureLink: "",
  },
  {
    itemName: "Coffee",
    purchaseDate: "2021-10-12T20:38:27.637+00:00",
    expirationDate: "2021-10-30T20:38:27.637+00:00",
    category: "Drinks",
    pictureLink: "",
  },
  {
    itemName: "Mozzarella",
    purchaseDate: "2021-10-12T20:38:27.637+00:00",
    expirationDate: "2021-10-30T20:38:27.637+00:00",
    category: "Produce",
    pictureLink: "",
  },
  {
    itemName: "Pasta",
    purchaseDate: "2021-10-12T20:38:27.637+00:00",
    expirationDate: "2021-10-30T20:38:27.637+00:00",
    category: "Carbs",
    pictureLink: "",
  },
  {
    itemName: "Tomato Paste",
    purchaseDate: "2021-10-12T20:38:27.637+00:00",
    expirationDate: "2021-10-30T20:38:27.637+00:00",
    category: "Canned Goods",
    pictureLink: "",
  },
  {
    itemName: "Crushed Tomato",
    purchaseDate: "2021-10-12T20:38:27.637+00:00",
    expirationDate: "2021-10-30T20:38:27.637+00:00",
    category: "Canned Goods",
    pictureLink: "",
  },
  {
    itemName: "Basil Leaves",
    purchaseDate: "2021-10-12T20:38:27.637+00:00",
    expirationDate: "2021-10-30T20:38:27.637+00:00",
    category: "Spices",
    pictureLink: "",
  },
];

const seedDB = async () => {
  await Item.deleteMany({});
  console.log("Deleted all items in Items collection");
  await Item.insertMany(seedItems);
  console.log("Seeded Items collection");
};
