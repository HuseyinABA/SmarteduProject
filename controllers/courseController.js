const Course = require('../models/Course');
const Category = require('../models/Category');

// CREATE A NEW COURSE
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID // Eğitmenin ID'si
    });
    // Her şey yolundaysa Dashboard'a geri dön
    res.status(201).redirect('/users/dashboard'); 
  } catch (error) {
    // Ekranda o boş {} yerine gerçek hatayı yazdıralım
    console.log("KURS EKLENİRKEN HATA:", error);
    res.status(400).send('KURS EKLENEMEDİ! Lütfen kurs adının veritabanında daha önce kullanılmadığından emin ol. Hata detayı: ' + error.message);
  }
};

// GET ALL COURSES
exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const category = await Category.findOne({slug: categorySlug})

    let filter = {};
    if(categorySlug) {
      filter = {category: category._id}
    }

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

// GET A SINGLE COURSE
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({slug: req.params.slug});
    res.status(200).render('course', {
      course,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};