const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const { ensureLoggedIn, ensureCorrectUser } = require("../auth/middlewares");

router.get("/", ensureLoggedIn, controller.findAll);
router.get("/:id", ensureCorrectUser, controller.findOne);

router.post("/register", controller.register);
router.post("/login", controller.login);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);

router.post("/:id", controller.addItem);
router.patch("/:id/:itemId", controller.updateItem);
router.delete("/:id/:itemId", controller.deleteItem);

module.exports = router;
