// Lightweight auth stub: attach a placeholder user if `x-api-key` header present
module.exports = (req, res, next) => {
  const apiKey = req.get('x-api-key');
  if (apiKey) {
    req.user = { apiKey, name: 'api-key-user' };
  }
  next();
};
