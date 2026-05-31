function getClientId(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function createRateLimiter(config) {
  const buckets = new Map();

  return function isAllowed(req) {
    const now = Date.now();
    const key = getClientId(req);
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + config.rateLimitWindowMs });
      return { allowed: true };
    }

    bucket.count += 1;
    if (bucket.count > config.rateLimitMax) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
      };
    }
    return { allowed: true };
  };
}

module.exports = {
  createRateLimiter,
};
