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

// Get all candidates
// route with designated endpoint /api/candidates (the api in the URL signifies that this is an API endpoint)
// callback function will handle client's request & the DB's response
// wrap the get() method around the DB call we made earlier & modify it a bit
// SQL statement SELECT * FROM candidates is assigned to sql variable
// send status code 500 and place error message within a json object (500 status code = server error, diff from 404 which is a user request error)
// return statement will exit the DB call once an error is encountered
// if no error, then err is null & response is sent back w/ success message etc.
app.get("/api/candidates", (req, res) => {
  const sql = `SELECT * FROM candidates`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// GET a single candidate
// using get() route method again - endpoint has a route parameter that will hold the value of the id to specifify which candidate we select from DB
// in DB call we assign captured value populated in req.params obj with the key id to params
// DB call will then query the candidates table w/ this id & retrieve row specified
// params is assigned as an array with a single element (req.params.id)
// error status code is 400 to notify client that their request was not accepted & to try a diff request
// in route response, we send the row back to the client in a json object
app.get("/api/candidate/:id", (req, res) => {
  const sql = `SELECT * FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

// Delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

// Create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//               VALUES (?,?,?,?)`;
// const params = [1, "Ronald", "Firbank", 1];

// db.query(sql, params, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

// add a route to handle user requests that are not supported by the app
// default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// add function that will start the Express.js server on port 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
