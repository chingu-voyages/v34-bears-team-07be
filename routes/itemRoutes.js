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

module.exports = router;
