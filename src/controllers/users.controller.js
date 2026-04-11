const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/users.js');
const { success, error: sendError } = require('../utils/response');

const getSingleUser = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const user = await User.findById(requestedUserId);
    if (!user) {
      return sendError(res, null, 'User not found', 404);
    }
    return success(res, user, 'User fetched', 200);
  } catch (err) {
    return sendError(res, err, 'Error fetching user', 500);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return success(res, users, 'Users fetched', 200);
  } catch (err) {
    return sendError(res, err, 'Error fetching users', 500);
  }
};

const createUser = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return sendError(res, null, 'Password is required', 400);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userPayload = { ...req.body, password: hashedPassword };
    const newUser = await User.create(userPayload);
    return success(res, newUser, 'User created', 201);
  } catch (err) {
    return sendError(res, err, 'Error creating user', 500);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) {
      return sendError(res, null, 'User not found', 404);
    }
    return success(res, updatedUser, 'User updated', 200);
  } catch (err) {
    return sendError(res, err, 'Error updating user', 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return sendError(res, null, 'User not found', 404);
    }
    return success(res, null, 'User deleted successfully', 200);
  } catch (err) {
    return sendError(res, err, 'Error deleting user', 500);
  }
};

module.exports = { getSingleUser, getAllUsers, createUser, updateUser, deleteUser };