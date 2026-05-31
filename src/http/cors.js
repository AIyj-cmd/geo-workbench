function isSameOrigin(origin, hostHeader) {
  if (!origin || !hostHeader) return true;
  try {
    return new URL(origin).host === hostHeader;
  } catch {
    return false;
  }
}

function applyCors(req, res, config) {
  const origin = req.headers.origin;
  if (!origin) return true;

  const allowed = config.allowedOrigins.includes(origin) || isSameOrigin(origin, req.headers.host);
  if (!allowed) return false;

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return true;
}

module.exports = {
  applyCors,
  isSameOrigin,
};
