const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const usersRouter = require("./routes/users");
const itemsRouter = require("./routes/itemRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas");
  });

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/users", usersRouter);
app.use("/api/items", itemsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
