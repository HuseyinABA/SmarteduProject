const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// POST request to create a category
router.route('/').post(categoryController.createCategory);

// POST request to delete a category
router.route('/:id/delete').post(categoryController.deleteCategory);

// POST request to update a category
router.route('/:id/update').post(categoryController.updateCategory);

module.exports = router;