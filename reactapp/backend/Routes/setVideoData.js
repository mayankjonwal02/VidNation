const express = require("express");
const router = express.Router();
const Mysql = require("mysql2/promise");
const app = express();

router.post("/setviews", async (req, res) => {
  try {
    const con = await Mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "jonwalmayank02",
      database: "mdntube",
    });
    let videoid = await req.body.videoid;
    let videotitle = await req.body.videotitle;

    let [videodata] = await con.execute(
      "SELECT * FROM videoclickthrough WHERE id = ?",
      [videoid]
    );

    console.log(videodata);
    if (videodata.length > 0) {
      let task = await con.execute(
        "UPDATE videoclickthrough SET views = ? WHERE id = ?",
        [parseInt(videodata[0].views) + 1, videoid]
      );
    } else {
      videodata = [{ id: videoid, title: videotitle, views: 0 }];
      let task = await con.execute(
        "INSERT INTO videoclickthrough (id,title,views) VALUES (?,?,?)",
        [videoid, videotitle, 1]
      );
    }

    console.log("success");
    res.json({ success: true, message: "success", data: videodata[0] });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
});

router.get("/getviews", async (req, res) => {
  try {
    const con = await Mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "jonwalmayank02",
      database: "mdntube",
    });

    let [videodata] = await con.execute(
      "SELECT id,views FROM videoclickthrough"
    );
    console.log("success");
    res.json({ success: true, message: "success", data: videodata });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
});
module.exports = router;
