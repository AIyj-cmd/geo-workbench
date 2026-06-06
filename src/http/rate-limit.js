function getClientId(req, trustProxy = false) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (trustProxy && typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function cleanupExpiredBuckets(buckets, now) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function createRateLimiter(config) {
  const buckets = new Map();
  const windowMs = Math.max(1, Number(config.rateLimitWindowMs) || 60000);
  const maxRequests = Math.max(1, Number(config.rateLimitMax) || 1);
  const trustProxy = config.trustProxy === true;
  let nextCleanupAt = Date.now() + windowMs;

  function isAllowed(req) {
    const now = Date.now();
    if (now >= nextCleanupAt) {
      cleanupExpiredBuckets(buckets, now);
      nextCleanupAt = now + windowMs;
    }

    const key = getClientId(req, trustProxy);
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true };
    }

    bucket.count += 1;
    if (bucket.count > maxRequests) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
      };
    }
    return { allowed: true };
  }

  isAllowed._cleanup = (now = Date.now()) => cleanupExpiredBuckets(buckets, now);
  isAllowed._bucketCount = () => buckets.size;
  isAllowed._getClientId = req => getClientId(req, trustProxy);

  return isAllowed;
}

module.exports = {
  createRateLimiter,
  cleanupExpiredBuckets,
  getClientId,
};
