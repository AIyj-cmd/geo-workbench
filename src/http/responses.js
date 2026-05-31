function sendJson(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  });
  res.end(JSON.stringify(payload));
}

function sendError(res, statusCode, code, message, headers = {}) {
  sendJson(res, statusCode, { error: { code, message } }, headers);
}

module.exports = {
  sendError,
  sendJson,
};
