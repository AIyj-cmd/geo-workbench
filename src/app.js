const http = require('http');
const { normalizeConfig } = require('./config');
const { handleChatProxy, handleStatus } = require('./chat/routes');
const { handleSelectedTitles, handlePoolTitles } = require('./titles/routes');
const { applyCors } = require('./http/cors');
const { createRateLimiter } = require('./http/rate-limit');
const { sendError } = require('./http/responses');
const { serveStatic } = require('./http/static-files');
const { parseRequestUrl } = require('./http/url');

function createServer(options = {}) {
  const config = normalizeConfig(options);
  const rateLimiter = createRateLimiter(config);

  return http.createServer((req, res) => {
    if (!applyCors(req, res, config)) {
      sendError(res, 403, 'CORS_ORIGIN_DENIED', 'Origin is not allowed');
      return;
    }

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = parseRequestUrl(req);
    if (!url) {
      sendError(res, 400, 'BAD_REQUEST', 'Invalid request URL');
      return;
    }

    if (url.pathname === '/api/status' && req.method === 'GET') {
      handleStatus(res, config);
      return;
    }

    if (url.pathname === '/api/titles/selected' && req.method === 'GET') {
      handleSelectedTitles(req, res);
      return;
    }

    if (url.pathname === '/api/titles/pool' && req.method === 'GET') {
      handlePoolTitles(req, res);
      return;
    }

    if (url.pathname === '/api/chat' && req.method === 'POST') {
      const limit = rateLimiter(req);
      if (!limit.allowed) {
        sendError(res, 429, 'RATE_LIMITED', 'Too many chat requests', {
          'Retry-After': String(limit.retryAfterSeconds),
        });
        return;
      }
      handleChatProxy(req, res, config);
      return;
    }

    if (url.pathname.startsWith('/api/')) {
      sendError(res, 404, 'NOT_FOUND', 'API endpoint not found');
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Allow': 'GET, HEAD',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end('405 Method Not Allowed');
      return;
    }

    serveStatic(req, res);
  });
}

module.exports = {
  createServer,
};
