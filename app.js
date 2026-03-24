const express = require("express");
const mongoose = require("mongoose");
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');
const cookieParser = require('cookie-parser');

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

// GLOBAL VARIABLE
global.userIN = null;

// MIDDLEWARES
app.use(express.static("public"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// GLOBAL USER VARIABLE MIDDLEWARE
app.use((req, res, next) => {

  userIN = req.cookies ? req.cookies.jwt : null;
  next();
});

// ROUTES
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});