const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.route('/').post(courseController.createCourse);
router.route('/').get(courseController.getAllCourses);
router.route('/enroll').post(courseController.enrollCourse); 
router.route('/release').post(courseController.releaseCourse);

// DELETE 
router.route('/:slug/delete').post(courseController.deleteCourse);

router.route('/:slug').get(courseController.getCourse);

module.exports = router;