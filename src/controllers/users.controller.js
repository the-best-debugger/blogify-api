const getSingleUser = (req, res) => {
  const requestedUserId = req.params.userId;

  res.status(200).json({
    success: true,
    message: `You requested data for User ID: ${requestedUserId}`
  });
};

module.exports = { getSingleUser };