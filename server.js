const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = 3010;
const CONFIG_PATH = path.join(__dirname, 'config.json');

// Load config
function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  } catch (e) {
    console.error('Failed to load config.json:', e.message);
    return { apiKey: '', apiUrl: 'https://token-plan-sgp.xiaomimimo.com/v1' };
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API proxy endpoint
  if (req.url === '/api/chat' && req.method === 'POST') {
    return handleChatProxy(req, res);
  }

  // API status check
  if (req.url === '/api/status' && req.method === 'GET') {
    const config = loadConfig();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      configured: !!config.apiKey,
      endpoint: config.apiUrl,
      models: [
        { id: 'mimo-v2.5-pro', type: 'text', desc: '最强推理，适合复杂内容' },
        { id: 'mimo-v2.5', type: 'text', desc: '通用文本生成' },
        { id: 'mimo-v2.5-tts-voiceclone', type: 'tts', desc: '语音克隆' },
        { id: 'mimo-v2.5-tts-voicedesign', type: 'tts', desc: '语音设计' },
        { id: 'mimo-v2.5-tts', type: 'tts', desc: '文字转语音' },
      ],
    }));
    return;
  }

  // Block access to sensitive files
  const blocked = ['/config.json', '/server.js', '/package.json'];
  if (blocked.includes(req.url) || req.url.endsWith('.json') && req.url !== '/api/status') {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Static files
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// Proxy chat requests to Xiaomi API
async function handleChatProxy(req, res) {
  const config = loadConfig();
  if (!config.apiKey) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API Key not configured on server' }));
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const payload = JSON.parse(body);
      const isStream = payload.stream === true;

      // Build upstream request
      const apiUrl = new URL(`${config.apiUrl}/chat/completions`);
      const postData = JSON.stringify({
        ...payload,
        // Don't let client override model to something unexpected
      });

      const options = {
        hostname: apiUrl.hostname,
        port: apiUrl.port || 443,
        path: apiUrl.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const proxyReq = https.request(options, (proxyRes) => {
        if (isStream) {
          // Stream mode: forward SSE chunks
          res.writeHead(proxyRes.statusCode, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          });
          proxyRes.on('data', chunk => res.write(chunk));
          proxyRes.on('end', () => res.end());
        } else {
          // Non-stream: buffer and return
          let data = '';
          proxyRes.on('data', chunk => { data += chunk; });
          proxyRes.on('end', () => {
            res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(data);
          });
        }
      });

      proxyReq.on('error', (e) => {
        console.error('Proxy error:', e.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Proxy error: ${e.message}` }));
      });

      proxyReq.write(postData);
      proxyReq.end();

    } catch (e) {
      console.error('Request parse error:', e.message);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid request body' }));
    }
  });
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`GEO Workbench running at http://0.0.0.0:${PORT}`);
});
