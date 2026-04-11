const { success, error: sendError } = require('../utils/response');
const postsService = require('../services/posts.service.js');

const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await postsService.getPostById(postId);
    if (!post) return sendError(res, null, 'Post not found', 404);
    return success(res, post, 'Post fetched', 200);
  } catch (err) {
    return sendError(res, err, 'Error fetching post', 500);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postsService.getAllPosts();
    return success(res, posts, 'Posts fetched', 200);
  } catch (err) {
    return sendError(res, err, 'Error fetching posts', 500);
  }
};

const createPost = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return sendError(res, null, 'Not authorized, no token.', 401);
    const payload = { ...req.body, author: req.user.id };
    const newPost = await postsService.createPost(payload);
    return success(res, newPost, 'Post created', 201);
  } catch (err) {
    return sendError(res, err, 'Error creating post', 500);
  }
};

const updatePost = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return sendError(res, null, 'Not authorized, no token.', 401);
    const post = await postsService.getPostById(req.params.postId);
    if (!post) return sendError(res, null, 'Post not found', 404);
    if (post.author._id.toString() !== req.user.id) return sendError(res, null, 'Not authorized', 403);
    const updatedPost = await postsService.updatePost(req.params.postId, req.body);
    return success(res, updatedPost, 'Post updated', 200);
  } catch (err) {
    return sendError(res, err, 'Error updating post', 500);
  }
};

const deletePost = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return sendError(res, null, 'Not authorized, no token.', 401);
    const post = await postsService.getPostById(req.params.postId);
    if (!post) return sendError(res, null, 'Post not found', 404);
    if (post.author._id.toString() !== req.user.id) return sendError(res, null, 'Not authorized', 403);
    const deleted = await postsService.deletePost(req.params.postId);
    return success(res, null, 'Post deleted successfully', 200);
  } catch (err) {
    return sendError(res, err, 'Error deleting post', 500);
  }
};

module.exports = {getAllPosts, getPostById, createPost, updatePost, deletePost};