const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).redirect('/'); 
  } catch (error) {
    res.status(400).send('Kayit Hatasi: ' + error.message);
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
        res.status(401).send('SIFRE HATALI!');
      }
    } else {
      res.status(404).send('KULLANICI BULUNAMADI!');
    }
  } catch (error) {
    res.status(400).send('Giris Hatasi: ' + error.message);
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({_id: req.session.userID});
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user
  });
};