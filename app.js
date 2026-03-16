const express = require("express");
const mongoose = require("mongoose");
const pageRoute = require('./routes/pageRoute');

const app = express();

// DATABASE CONNECTION
mongoose.connect('mongodb://127.0.0.1/smartedu-db')
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });

// TEMPLATE ENGINE
app.set("view engine", "ejs");

// MIDDLEWARES
app.use(express.static("public"));
app.use(express.json()); // For parsing application/json (Postman)
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// ROUTES
app.use('/', pageRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});