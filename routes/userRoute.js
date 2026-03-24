const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Import the security middleware
const authMiddleware = require('../middlewares/authMiddleware');

// PROTECTED ROUTE: Apply authMiddleware BEFORE the controller function
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage);

// AUTHENTICATION ROUTES
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);

// ... (keep your existing routes for signup, delete, update here) ...

module.exports = router;