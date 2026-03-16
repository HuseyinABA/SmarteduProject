const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try {
        await User.create(req.body);
        res.status(201).redirect('/');
    } catch (error) {
        res.status(400).send('Hata: ' + error.message);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            const same = await bcrypt.compare(password, user.password);
            if (same) {
                // OTURUMU SENİN APP.JS'DEKİ MİDDLEWARE İLE EŞLİYORUZ
                req.session.userID = user._id;
                res.status(200).redirect('/');
            } else {
                res.status(401).send('Şifre yanlış!');
            }
        } else {
            res.status(404).send('Kullanıcı bulunamadı!');
        }
    } catch (error) {
        res.status(400).send('Giriş hatası!');
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};