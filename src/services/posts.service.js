const Post = require('../../models/posts');

const authorPopulate = 'username email createdAt';

async function getAllPosts() {
  return Post.find({}).populate('author', authorPopulate).exec();
}

async function getPostById(postId) {
  return Post.findById(postId).populate('author', authorPopulate).exec();
}

async function createPost(data) {
  const created = await Post.create(data);
  return Post.findById(created._id).populate('author', authorPopulate).exec();
}

async function updatePost(postId, data) {
  return Post.findByIdAndUpdate(postId, data, { new: true }).populate('author', authorPopulate).exec();
}

async function deletePost(postId) {
  return Post.findByIdAndDelete(postId).exec();
}

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };
