const mongoose = require("mongoose");
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const { createToken } = require("../auth/tokens");
const {
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
} = require("../expressError");

exports.findAll = async function (req, res, next) {
    try {
        const users = await User.find();
        if (!users) throw new NotFoundError("No users found.");
        return res.status(200).json({ users });
    } catch (e) {
        return next(e);
    }
};

exports.findOne = async function (req, res, next) {
    try {
        const { id } = req.params;
        const user = await getUser(id);
        return res.status(200).json({ user });
    } catch (e) {
        return next(e);
    }
};

exports.register = async function (req, res, next) {
    try {
        const { username, password, email } = req.body;
        // check if password is null
        if (!password) throw new BadRequestError("Password is required.");
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email });
        await user.save();
        const token = await createToken(user);
        return res.status(201).json({ token });
    } catch (e) {
        return next(e);
    }
};

exports.login = async function (req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw new BadRequestError("Email and password are required.");
        const user = await User.findOne({ email: email });
        if (!user) throw new BadRequestError("User not found.");
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            const token = createToken(user);
            return res.json({ token });
        } else {
            throw new UnauthorizedError("Invalid username/password");
        }
    } catch (e) {
        return next(e);
    }
};

exports.update = async function (req, res, next) {
    try {
        const { id } = req.params;
        let updateInfo = { ...req.body };
        if (updateInfo.password) {
            updateInfo.password = await bcrypt.hash(updateInfo.password, 10);
        }
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new BadRequestError("Invalid id.");
        const updatedUser = await User.findByIdAndUpdate(id, updateInfo, {
            new: true,
        });
        if (!updatedUser) throw new NotFoundError("User not found.");
        let returnUser = updatedUser.toObject();
        delete returnUser.password;
        return res.status(200).json({ user: returnUser });
    } catch (e) {
        return next(e);
    }
};

exports.delete = async function (req, res, next) {
    try {
        const { id } = req.params;
        const user = await getUser(id);
        user.remove();
        return res.status(202).json({ message: "User deleted." });
    } catch (e) {
        return next(e);
    }
};

exports.addItem = async function (req, res, next) {
    try {
        const { id } = req.params;
        const user = await getUser(id);
        if (req.body.length) {
            user.pantry.push(...req.body);
        } else {
            user.pantry.push(req.body);
        }
        await user.save();
        return res.status(202).json({ message: "Item added." });
    } catch (e) {
        return next(e);
    }
};

exports.updateItem = async function (req, res, next) {
    try {
        const { id, itemId } = req.params;
        if (!mongoose.isValidObjectId(itemId))
            throw new BadRequestError("Invalid item id.");
        const user = await getUser(id);

        for (let i = 0; i < user.pantry.length; i++) {
            if (user.pantry[i].id == itemId) {
                item = { ...user.pantry[i]._doc, ...req.body };
                user.pantry.splice(i, 1, item);
            }
        }
        user.save();
        return res.status(200).json("Item updated.");
    } catch (e) {
        return next(e);
    }
};

exports.deleteItem = async function (req, res, next) {
    try {
        const { id, itemId } = req.params;
        const user = await getUser(id);
        if (!mongoose.isValidObjectId(itemId))
            throw new BadRequestError("Invalid item id.");
        user.pantry = user.pantry.filter((item) => item.id !== itemId);
        user.save();
        return res.status(202).json("Item deleted.");
    } catch (e) {
        return next(e);
    }
};

exports.addItemToCart = async function (req, res, next) {
    try {
        const { id } = req.params;
        const user = await getUser(id);
        if (req.body.length) {
            user.cart.push(...req.body);
        } else {
            user.cart.push(req.body);
        }
        await user.save();
        return res.status(202).json({ message: "Item added." });
    } catch (e) {
        return next(e);
    }
};

exports.updateCartItem = async function (req, res, next) {
    try {
        const { id, itemId } = req.params;
        if (!mongoose.isValidObjectId(itemId))
            throw new BadRequestError("Invalid item id.");
        const user = await getUser(id);

        for (let i = 0; i < user.cart.length; i++) {
            if (user.cart[i].id == itemId) {
                item = { ...user.cart[i]._doc, ...req.body };
                user.cart.splice(i, 1, item);
            }
        }
        user.save();
        return res.status(200).json("Item updated.");
    } catch (e) {
        return next(e);
    }
};

exports.deleteCartItem = async function (req, res, next) {
    try {
        const { id, itemId } = req.params;
        const user = await getUser(id);
        if (!mongoose.isValidObjectId(itemId))
            throw new BadRequestError("Invalid item id.");
        user.cart = user.cart.filter((item) => item.id !== itemId);
        user.save();
        return res.status(202).json("Item deleted.");
    } catch (e) {
        return next(e);
    }
};

async function getUser(id) {
    if (!mongoose.isValidObjectId(id))
        throw new BadRequestError("Invalid user id.");
    let user = await User.findById(id);
    if (!user) throw new NotFoundError("User not found.");
    return user;
}
