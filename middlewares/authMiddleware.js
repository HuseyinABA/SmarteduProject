const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.redirect('/'); 
    }

    const decoded = jwt.verify(token, 'smartedu_secret_key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.redirect('/'); 
    }

    req.user = user;
    res.locals.user = user;
    next();

  } catch (error) {

    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/'); 
  }
};