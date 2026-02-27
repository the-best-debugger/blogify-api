function success(res, data = null, message = 'OK', status = 200) {
  return res.status(status).json({ success: true, message, data });
}

function error(res, err = null, message = 'Error', status = 500) {
  const payload = { success: false, message };
  if (err) {
    // include minimal error info
    payload.error = typeof err === 'string' ? err : (err.message || err);
  }
  return res.status(status).json(payload);
}

module.exports = { success, error };
