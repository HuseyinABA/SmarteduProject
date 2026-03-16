const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// POST request to create a category
router.route('/').post(categoryController.createCategory);

module.exports = router;