const mongoose = require("mongoose");

const ShoppingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    // below might need to be changed to "useR"
    ref: "user"
  },
  open: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true
  },
  items: {
    type: [String],
    required: true
  }
});

module.exports = Shopping = mongoose.model("shopping", ShoppingSchema);
