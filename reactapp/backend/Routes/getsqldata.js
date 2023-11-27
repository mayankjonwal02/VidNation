const express = require("express");
const mysql = require("mysql2/promise"); // Use mysql2 with promise support
const router = express.Router();

router.get("/sqldata", async (req, res) => {
  try {
    const con = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "jonwalmayank02",
      database: "hospitaldatabase",
    });

    const [rows] = await con.execute(
      "SELECT * FROM patientdata WHERE patientid = ?",
      ["p7"]
    );
    const data = Array.from(rows); // Convert rows to a plain array
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log("Error in fetching data", error.message);
  }
});

module.exports = router;
