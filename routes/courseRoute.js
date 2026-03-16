const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.route('/').post(courseController.createCourse);
router.route('/').get(courseController.getAllCourses);

// MUST BE DEFINED BEFORE /:slug TO PREVENT ROUTING CONFLICTS
router.route('/enroll').post(courseController.enrollCourse); 
router.route('/release').post(courseController.releaseCourse);

router.route('/:slug').get(courseController.getCourse);

module.exports = router;