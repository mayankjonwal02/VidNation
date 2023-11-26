const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/createuser", async (req, res) => {
  try {
    await User.create({
      email: req.body.email,
      password: req.body.password,
    });

    console.log("User Created !!");
    res.json({ success: true, message: "Registration Successful !!" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  let email = req.body.email;
  try {
    let userdata = await User.findOne({ email });

    if (userdata) {
      console.log(userdata);
      if (req.body.password === userdata.password) {
        console.log("login Successful");

        return res
          .status(400)
          .json({ success: true, message: "Login Successful" });
      }
      return res
        .status(400)
        .json({ success: false, errors: "Incorrect Credentials" });
    }

    return res.status(400).json({ success: false, errors: "invalid Email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, errors: error });
  }
});

module.exports = router;
