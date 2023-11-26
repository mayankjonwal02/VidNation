var mysql = require("mysql");

const MySql = async () => {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "jonwalmayank02",
    database: "mdntube",
  });

  try {
    await con.connect();
    console.log(
      "--------------------connected to the MySQL database---------------------------"
    );
  } catch (error) {
    console.log("error connecting mysql", error.message);
  }
};

module.exports = MySql;
