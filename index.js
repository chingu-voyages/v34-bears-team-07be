const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const usersRouter = require("./routes/users");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", usersRouter);

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);
});
