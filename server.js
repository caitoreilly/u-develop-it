// import express
const express = require("express");

// add PORT designation and initialze the app
const PORT = process.env.PORT || 3001;
const app = express();

// add express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// add a route to handle user requests that are not supported by the app
// default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// add function that will start the Express.js server on port 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
