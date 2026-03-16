const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

// POST request to create a course
router.route('/').post(courseController.createCourse);

module.exports = router;