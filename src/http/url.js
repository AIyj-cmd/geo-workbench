function parseRequestUrl(req) {
  try {
    return new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch {
    return null;
  }
}

module.exports = {
  parseRequestUrl,
};
