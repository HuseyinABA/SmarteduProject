// At the top of your file, ensure you have these requires:
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const Category = require('../models/Category');
const Course = require('../models/Course');

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
    
    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).redirect('/login');
    }

    // 2. Compare the provided password with the hashed database password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).redirect('/login');
    }

    // 3. Create a JSON Web Token (JWT)
    // Note: 'smartedu_secret_key' should ideally be stored securely in a .env file
    const token = jwt.sign(
      { userId: user._id }, 
      'smartedu_secret_key', 
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // 4. Send the token via an HTTP-only cookie
    // This prevents XSS (Cross-Site Scripting) attacks
    res.cookie('jwt', token, {
      httpOnly: true, 
      maxAge: 1000 * 60 * 60 * 24 // 1 day in milliseconds
    });

    // 5. Redirect to dashboard upon successful login
    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.logoutUser = (req, res) => {
  // Clear the JWT cookie to effectively log the user out
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};


// GET DASHBOARD 
exports.getDashboardPage = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).populate('courses');
    
    const categories = await Category.find();
    const courses = await Course.find({ user: req.user._id });
    const users = await User.find();

    res.status(200).render('dashboard', {
      page_name: 'dashboard',
      user,
      categories,
      courses,
      users
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
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

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.email = req.body.email;
    user.role = req.body.role;
    await user.save();
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};