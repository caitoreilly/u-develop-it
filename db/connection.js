// import mysql2 package
const mysql = require("mysql2");

// code that will connect the app to the MySQL database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Daniel0815!",
    database: "election",
  },
  console.log("Connected to the election database.")
);

// export file bc it is its own module now
module.exports = db;
