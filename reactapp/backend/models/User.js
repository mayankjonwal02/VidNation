const { json } = require("express");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  RegisteredOn: {
    type: Date,
    default: Date.now,
  },

  history: [
    {
      historydata: {
        type: String,
      },
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("user", UserSchema);
