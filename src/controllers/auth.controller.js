const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/users');
const { success, error: sendError } = require('../utils/response');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return sendError(res, null, 'Email and password required', 400);
    const user = await User.findOne({ email });
    if (!user) return sendError(res, null, 'Invalid credentials', 401);
    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendError(res, null, 'Invalid credentials', 401);
    if (!process.env.JWT_SECRET) return sendError(res, null, 'Server misconfiguration: JWT_SECRET not set', 500);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000
    });
    return success(res, { id: user._id, username: user.username, email: user.email }, 'Logged in', 200);
  } catch (err) {
    return sendError(res, err, 'Error logging in', 500);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    return success(res, null, 'Logged out', 200);
  } catch (err) {
    return sendError(res, err, 'Error logging out', 500);
  }
};

module.exports = { loginUser, logoutUser };
