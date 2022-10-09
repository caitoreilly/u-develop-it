// import mysql2 package
const mysql = require("mysql2");

// import express
const express = require("express");

// import module for inputCheck
const inputCheck = require("./utils/inputCheck");

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
  const sql = `SELECT candidates.*, parties.name
  AS party_name
  FROM candidates
  LEFT JOIN parties
  ON candidates.party_id = parties.id`;

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
  const sql = `SELECT candidates.*, parties.name
  AS party_name
  FROM candidates
  LEFT JOIN parties
  ON candidates.party_id = parties.id
  WHERE candidates.id = ?`;
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
// use the HTTP request method delete()
// endpoint here also includes a route parameter to uniquely identify the candidate to remove
// using prepared SQL statement w/ a placeholder
// assign req.params.id to params like in the last route
// json object route response will be the message 'deleted' with the changes property set to result.affectedRows - verifies if any rows were changed
// what is user tries to delete candidate that does not exist? --> else if statement
// if no affectedRows as a result of the delete query, that means no candidate by that id
// therefore return an approp message to the client "candidate not found"
app.delete("/api/candidate/:id", (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "Candidate not found",
      });
    } else {
      res.json({
        message: "deleted",
        changes: result.affectedRows,
        id: req.params.id,
      });
    }
  });
});

// Create a candidate
// http request method post() to insert a candidate into the candidates table - use endpoint /api/candidates
// in callback function, use object req.body to populate the candidate's data (using object destructuring to pull body property out of the request object)
// assign errors to receive the return from the inputCheck function
// validate user data before changes inserted into the DB
// if inputCheck() function returns error, an err message is returned to client as a 400 status code to prompt for diff user request w/ json obj that contains the reasons for the error
// import module at top of file
app.post("/api/candidate", ({ body }, res) => {
  const errors = inputCheck(
    body,
    "first_name",
    "last_name",
    "industry_connected"
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  // add the database call inside the POST routine below if (errors) block
  // MySQL will autogenerate id, params assignment has 3 elements in its array that contains the user data collected in req.body
  //use query() method to execute prepared sql statement - we send the response using res.json() method w/ a success message & user data that was used to create the new data entry
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
    });
  });
});

// add a route to handle user requests that are not supported by the app
// default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// add function that will start the Express.js server on port 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
