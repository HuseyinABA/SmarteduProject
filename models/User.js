const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// Modern async/await approach WITHOUT 'next'
UserSchema.pre('save', async function() {
  const user = this;
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
});

const User = mongoose.model('User', UserSchema);
module.exports = User;