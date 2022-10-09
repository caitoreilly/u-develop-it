// import mysql2 package
const mysql = require("mysql2");

// import express
const express = require("express");

// add PORT designation and initialze the app
const PORT = process.env.PORT || 3001;
const app = express();

// add express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

// add a route to handle user requests that are not supported by the app
// default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// add function that will start the Express.js server on port 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
