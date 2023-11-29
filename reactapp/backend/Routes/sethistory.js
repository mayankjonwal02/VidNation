// routes/updateDocument.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/updateDocument", async (req, res) => {
  const { email, newData } = req.body;

  try {
    const result = await User.findOneAndUpdate(
      { email: email },
      {
        $push: {
          history: {
            historydata: newData.historydata,
            date: newData.date || new Date(), // Use provided date or default to current date
          },
        },
      },
      { new: true } // returns the modified document
    );

    if (result) {
      console.log("Document updated successfully");
      res.status(200).json({
        message: "Document updated successfully",
        updatedDocument: result,
      });
    } else {
      console.log("No user found with the specified email");
      res
        .status(404)
        .json({ message: "No user found with the specified email" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
