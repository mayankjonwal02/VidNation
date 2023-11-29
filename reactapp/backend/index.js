const express = require("express");
const mongodb = require("./mongoDB_connection");
const mysql = require("./mySQL_connection");
const Neo4j = require("./neo4j_connection");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World! this is VidNation");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(express.json());
app.use("/api", require("./Routes/getdata_mongo"));
app.use("/api", require("./Routes/getsqldata"));
app.use("/api", require("./Routes/UserHandling"));
app.use("/api", require("./Routes/setVideoData"));
app.use("/api", require("./Routes/sethistory"));

mongodb();
mysql();
Neo4j();
