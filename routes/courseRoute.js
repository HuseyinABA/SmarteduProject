const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

// GET request to list all courses
router.route('/').get(courseController.getAllCourses);

// POST request to create a course
router.route('/').post(courseController.createCourse);

module.exports = router;