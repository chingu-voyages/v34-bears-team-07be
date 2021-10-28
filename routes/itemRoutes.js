const router = require("express").Router();
const Item = require("../models/Items");

// Get an item by id
router.get("/:itemId", async (req, res) => {
    // Try to find the item that the user is specifying
    try {
        const item = await Item.findById(req.params.itemId);
        res.status(200).json(item);
    } catch (err) {
        res.status(404).json("Item not found");
    }
});

// Search items by name
router.get("/search/:itemName", async (req, res) => {
    // Try to find the items that match the key words
    try {
        const items = await Item.find({
            name: { $regex: `.*${req.params.itemName}.*` },
        });
        res.status(200).json(items);
    } catch (err) {
        res.status(404).json("Items not found");
    }
});

// Update an item by id
router.patch("/:itemId", async (req, res) => {
    // Try to find the item that the user is specifying
    try {
        await Item.findById(req.params.itemId);
        // Try updating the item
        try {
            const updatedItem = await Item.findByIdAndUpdate(
                req.params.itemId,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json(updatedItem);
        } catch (err) {
            res.status(500).json(err);
        }
    } catch {
        res.status(404).json("Item not found");
    }
});

// Delete an item by id
router.delete("/:itemId", async (req, res) => {
    try {
        await Item.findById(req.params.itemId);
        try {
            await Item.findByIdAndDelete(req.params.itemId);
            res.status(200).json("Product deleted");
        } catch (err) {
            res.status(500).json(err);
        }
    } catch {
        res.status(404).json("Item not found");
    }
});

module.exports = router;
