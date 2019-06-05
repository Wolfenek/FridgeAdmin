const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/middleware");
const { check, validationResult } = require("express-validator/check");
const Shopping = require("../../models/Shopping");

// const Profile = require("../../models/Profile");

//@route     POST api/shopping
//@desc      Create a shopping list
//@access    Private
router.post(
  "/",
  [
    middleware,
    [
      check("items", "Items are required")
        .not()
        .isEmpty(),
      check("name", "Name is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { items, name } = req.body;

      const newList = {};
      newList.user = req.user.id;
      if (name) newList.name = name.trim();
      if (items) {
        newList.items = items.split(",").map(item => item.trim());
      }

      list = new Shopping(newList);

      await list.save();
      res.json(list);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
