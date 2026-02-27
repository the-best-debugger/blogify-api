const { error: sendError } = require('../utils/response');

module.exports = (err, req, res, next) => {
  // In dev you might log the full err
  console.error('Unhandled error:', err);
  // Use standardized error responder
  return sendError(res, err, err.message || 'Internal Server Error', err.status || 500);
};
