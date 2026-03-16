const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    unique: true
  }
});

// Create slug from the name before saving (Updated for modern Mongoose)
CategorySchema.pre('validate', function(){
  this.slug = slugify(this.name, {
    lower: true,
    strict: true
  });
});

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;