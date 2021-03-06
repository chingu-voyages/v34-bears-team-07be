const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { authenticateJWT } = require("./auth/middlewares");

const usersRouter = require("./routes/users");
const itemsRouter = require("./routes/itemRoutes");
const { NotFoundError } = require("./expressError");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticateJWT);

mongoose.set("runValidators", true);
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

// If no endpoint matches
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

// Handle error output
app.use(function (err, req, res, next) {
    // handle validationError
    if (err.name === "ValidationError") {
        let errors = {};
        Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message;
        });
        return res.status(400).json({ error: errors });
    }
    // handle email duplication error
    else if (err.name === "MongoServerError" && err.code === 11000) {
        return res
            .status(400)
            .json({ error: "This email address has been registered." });
    }
    // handle normal error
    else {
        console.error(err.stack);

        const status = err.status || 500;
        const message = err.message;

        return res.status(status).json({
            error: message,
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);
});
