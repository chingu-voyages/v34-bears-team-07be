const router = require("express").Router();
const Item = require("../models/Items");

// Create Item
router.post("/", async (req, res) => {
  const item = {
    itemName: req.body.itemName,
    // Date should be of format mm/dd/yyyy
    expirationDate: new Date(req.body.expirationDate),
    category: req.body.category,
  };
  // Check to ensure all fields are populated
  for (const [key, value] of Object.entries(item)) {
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` },
      });
    }
  }
  // Try saving the product to the db
  try {
    let newItem = new Item(item);
    newItem = await newItem.save();
    res.status(200).json(newItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

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
