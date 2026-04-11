const express = require('express');
const router = express.Router();

const postController = require('../controllers/posts.controller.js');
const protect = require('../middleware/auth');

router.get('/:postId', postController.getPostById);
router.get('/', postController.getAllPosts);
router.post('/', protect, postController.createPost);
router.put('/:postId', protect, postController.updatePost);
router.delete('/:postId', protect, postController.deletePost);

module.exports = router;