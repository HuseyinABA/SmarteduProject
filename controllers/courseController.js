const Course = require('../models/Course');
const Category = require('../models/Category');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({
      status: 'success',
      course,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

// Get all courses and categories
exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const query = req.query.search;
    
    let category = null;
    if (categorySlug) {
      category = await Category.findOne({ slug: categorySlug });
    }

    let filter = {};
    if (category) {
      filter = { category: category._id };
    }

    // Fetch courses based on filter and all categories for the sidebar
    const courses = await Course.find(filter).sort('-createdAt');
    const categories = await Category.find();

    res.status(200).render('courses', {
      courses,
      categories,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};