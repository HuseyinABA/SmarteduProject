const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');

// CREATE A NEW COURSE
exports.createCourse = async (req, res) => {
  try {
    await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID // TEACHER'S ID
    });
    res.status(201).redirect('/users/dashboard'); 
  } catch (error) {
    console.log("ERROR CREATING COURSE:", error);
    res.status(400).send('ERROR: Course name must be unique. ' + error.message);
  }
};

// GET ALL COURSES
exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const category = await Category.findOne({slug: categorySlug});

    let filter = {};
    if(categorySlug) {
      filter = {category: category._id};
    }

    const courses = await Course.find(filter).sort('-createdAt');
    const categories = await Category.find();

    res.status(200).render('courses', {
      courses,
      categories,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error });
  }
};

// GET A SINGLE COURSE
exports.getCourse = async (req, res) => {
  try {
    // CHECK IF A USER IS LOGGED IN TO MANAGE ENROLL BUTTON VISIBILITY
    let user = null;
    if (req.session.userID) {
        user = await User.findById(req.session.userID);
    }
    
    const course = await Course.findOne({slug: req.params.slug}).populate('user');

    res.status(200).render('course', {
      course,
      page_name: 'courses',
      user
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', error });
  }
};

// ENROLL A STUDENT IN A COURSE
exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.push({_id: req.body.course_id});
    await user.save();

    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({ status: 'fail', error });
  }
};

// RELEASE (DROP) A COURSE FOR A STUDENT
exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({_id: req.body.course_id});
    await user.save();

    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({ status: 'fail', error });
  }
};