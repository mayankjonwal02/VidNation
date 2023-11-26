const neo4j = require("neo4j-driver");

const Neo4j = async () => {
  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  const URI = "bolt://172.31.57.99:7687"; // "neo4j+s://neo4j@120090f6.databases.neo4j.io:7687";
  const USER = "neo4j";
  const PASSWORD = "nitish@31"; //"JUH1BLZ1MOs7OAn4mOsk4jLE1fVB091EsgsAXgi2Fxg";
  let driver;

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const serverInfo = await driver.getServerInfo();
    console.log(
      "------------------------Connection established with Neo4j------------------------"
    );
    // console.log(serverInfo);
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
  }
};

module.exports = Neo4j;
