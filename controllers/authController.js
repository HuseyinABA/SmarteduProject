const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).redirect('/'); 
  } catch (error) {
    res.status(400).send('Registration Failed: ' + error.message);
  }
};

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

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

// GET DASHBOARD 
exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({_id: req.session.userID}).populate('courses'); 
  const categories = await Category.find();
  const courses = await Course.find({user: req.session.userID}); 
  const users = await User.find(); 

  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses,
    users
  });
};

// DELETE USER FOR ADMIN 
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Course.deleteMany({user: req.params.id});
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({ status: 'fail', error });
  }
};