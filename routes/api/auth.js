const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/middleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

//@route     GET api/auth
//@desc      Test route
//@access    Public
router.get("/", middleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route     POST api/auth
//@desc      Authenticate user and get token
//@access    Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please choose a password").exists()
  ],

  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ erors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user DOES NOT exist
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Login Data" }] });
      }

      // Compare passwords (user input and actual saved password)
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Login Data" }] });
      }

      // Get payload with user id
      const payload = {
        user: {
          id: user.id
        }
      };

      // Return jsonwebtocken
      jwt.sign(
        payload,
        config.get("jwtToken"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
