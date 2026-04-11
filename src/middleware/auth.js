const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET not set' });
    }
    const token = req.cookies && req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authorized, no token.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid.' });
  }
};
