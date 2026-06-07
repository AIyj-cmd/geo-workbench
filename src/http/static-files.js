const fs = require('fs');
const path = require('path');
const { ROOT_DIR } = require('../config');
const { parseRequestUrl } = require('./url');

const PUBLIC_FILES = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/app.js', 'app.js'],
  ['/src/frontend/state-storage.js', 'src/frontend/state-storage.js'],
  ['/src/frontend/ai-client.js', 'src/frontend/ai-client.js'],
  ['/src/frontend/export-client.js', 'src/frontend/export-client.js'],
  ['/style.css', 'style.css'],
  ['/dist-card.css', 'dist-card.css'],
  ['/logo.jpg', 'logo.jpg'],
  ['/favicon.ico', 'logo.jpg'],
]);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

function resolvePublicFile(urlPath) {
  if (!PUBLIC_FILES.has(urlPath)) return null;

  const filePath = path.resolve(ROOT_DIR, PUBLIC_FILES.get(urlPath));
  if (filePath !== ROOT_DIR && !filePath.startsWith(`${ROOT_DIR}${path.sep}`)) {
    return null;
  }
  return filePath;
}

function sendNotFound(res) {
  res.writeHead(404, {
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end('404 Not Found');
}

function serveStatic(req, res) {
  const url = parseRequestUrl(req);
  if (!url) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('400 Bad Request');
    return;
  }

  const filePath = resolvePublicFile(url.pathname);
  if (!filePath) {
    sendNotFound(res);
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendNotFound(res);
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=300',
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}

module.exports = {
  resolvePublicFile,
  serveStatic,
};
