module.exports = (req, res, next) => {
  const now = new Date().toISOString();
  const bodyPreview = req.body && Object.keys(req.body).length ? ` body=${JSON.stringify(req.body)}` : '';
  console.log(`${now} ${req.method} ${req.originalUrl}${bodyPreview}`);
  next();
};
