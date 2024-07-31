const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { hashPassword } = require('../utils/encryption');

exports.registerUser = async (userData) => {
  const { name, email, password } = userData;
  const hashedPassword = await hashPassword(password);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  return generateToken(user._id);
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  return generateToken(user._id);
};