const getAllPosts = (req, res) => {

  const posts = [
    { id: 1, title: 'Controller Post 1' },
    { id: 2, title: 'Controller Post 2' }
  ];

  res.status(200).json({
    message: 'Posts fetched successfully',
    data: posts
  });
};

const getPostById = (req, res) => {
  const postId = req.params.postId;

  res.status(200).json({
    message: `Fetching data for post with ID:  ${postId}`
  });
};

module.exports = {getAllPosts, getPostById};