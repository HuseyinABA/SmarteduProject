const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const bcrypt = require('bcrypt');

// CREATE NEW USER
exports.createUser = async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).redirect('/'); 
  } catch (error) {
    res.status(400).send('Registration Failed: ' + error.message);
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const same = await bcrypt.compare(password, user.password);
      if (same) {
        req.session.userID = user._id; 
        res.status(200).redirect('/users/dashboard'); 
      } else {
        res.status(401).send('WRONG PASSWORD');
      }
    } else {
      res.status(404).send('USER NOT FOUND');
    }
  } catch (error) {
    res.status(400).send('Login Failed: ' + error.message);
  }
};

// LOGOUT USER
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

// GET DASHBOARD PAGE
exports.getDashboardPage = async (req, res) => {
  // FETCH USER AND POPULATE ENROLLED COURSES FOR STUDENTS
  const user = await User.findOne({_id: req.session.userID}).populate('courses'); 
  const categories = await Category.find();
  const courses = await Course.find({user: req.session.userID}); 

  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses
  });
};