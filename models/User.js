const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["student", "teacher", "admin"], 
    default: "student" 
  },
  // ARRAY TO STORE ENROLLED COURSES FOR STUDENTS
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

// MODERN ASYNC STRUCTURE: HASH PASSWORD BEFORE SAVING
UserSchema.pre('save', async function() {
  const user = this;
  if (!user.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
});

const User = mongoose.model('User', UserSchema);
module.exports = User;