const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  nickname: {
    type: String,
    required: true
  }
});

module.exports = Shopping = mongoose.model("profile", ProfileSchema);
