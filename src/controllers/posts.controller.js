const mongoose = require('mongoose');
const Post = require('../../models/posts.js');
const { success, error: sendError } = require('../utils/response');

const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return sendError(res, null, 'Post not found', 404);
    }
    return success(res, post, 'Post fetched', 200);
  } catch (err) {
    return sendError(res, err, 'Error fetching post', 500);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    return success(res, posts, 'Posts fetched', 200);
  } catch (err) {
    return sendError(res, err, 'Error fetching posts', 500);
  }
};

const createPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    return success(res, newPost, 'Post created', 201);
  } catch (err) {
    return sendError(res, err, 'Error creating post', 500);
  }
};

const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true });
    return success(res, updatedPost, 'Post updated', 200);
  } catch (err) {
    return sendError(res, err, 'Error updating post', 500);
  }
};

const deletePost = async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.postId);
    if (!deleted) {
      return sendError(res, null, 'Post not found', 404);
    }
    return success(res, null, 'Post deleted successfully', 200);
  } catch (err) {
    return sendError(res, err, 'Error deleting post', 500);
  }
};

module.exports = {getAllPosts, getPostById, createPost, updatePost, deletePost};