const posts = [
    { id: 1, title: 'Controller Post 1' },
    { id: 2, title: 'Controller Post 2' }
  ];

const getAllPosts = (req, res) => {

  res.status(200).json({
    success: true,
    data: posts
  });
};

const getPostById = (req, res) => {
  const postId = req.params.postId;

  res.status(200).json({
    success: true,
    data: posts.find(post => post.id === parseInt(postId))
  });
};

module.exports = {getAllPosts, getPostById};