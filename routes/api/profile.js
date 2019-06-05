const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/middleware");
const { check, validationResult } = require("express-validator/check");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route     GET api/profile/me
//@desc      Get current user profile
//@access    Private
router.get("/me", middleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "User doesn't exist" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route     POST api/profile/
//@desc      Create or update user profile
//@access    Private

router.post(
  "/",
  [
    middleware,
    [
      check("nickname", "nickname is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Pull out "nickname" out of ProfileSchema
    const { nickname } = req.body;
    // Build profile object (event if it only has "nickname in it")
    const profileFields = {};
    profileFields.user = req.user.id;
    if (nickname) profileFields.nickname = nickname;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update...
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //...or create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route     DELETE api/profile/
//@desc      Delete profile, user and posts
//@access    Private

router.delete("/", middleware, async (req, res) => {
  try {
    // @todo - remove user's posts

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(500).send("Server Error");
  }
});

module.exports = router;
