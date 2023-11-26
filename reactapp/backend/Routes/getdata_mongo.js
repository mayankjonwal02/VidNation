const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get(
  "/getMongoData",

  async (req, res) => {
    try {
      let data = await mongoose.connection.db
        .collection("Video Dataset")
        .find({})
        .toArray();
      //   console.log(data);
      res.json(data);
    } catch (error) {
      console.log(error.message);
      res.json({ errors: error });
    }
  }
);

module.exports = router;
