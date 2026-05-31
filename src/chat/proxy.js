const http = require('http');
const https = require('https');
const { DEFAULT_API_URL } = require('../config');
const { sendError } = require('../http/responses');

function buildChatCompletionUrl(apiUrl) {
  const base = String(apiUrl || DEFAULT_API_URL).replace(/\/+$/, '');
  return new URL(`${base}/chat/completions`);
}

function proxyToUpstream(payload, config, res) {
  const apiUrl = buildChatCompletionUrl(config.apiUrl);
  const postData = JSON.stringify(payload);
  const transport = apiUrl.protocol === 'http:' ? http : https;

  const proxyReq = transport.request({
    protocol: apiUrl.protocol,
    hostname: apiUrl.hostname,
    port: apiUrl.port || (apiUrl.protocol === 'http:' ? 80 : 443),
    path: `${apiUrl.pathname}${apiUrl.search}`,
    method: 'POST',
    timeout: config.upstreamTimeoutMs,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Length': Buffer.byteLength(postData),
    },
  }, proxyRes => {
    const statusCode = proxyRes.statusCode || 502;

    if (payload.stream) {
      res.writeHead(statusCode, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
      });
      proxyRes.on('data', chunk => res.write(chunk));
      proxyRes.on('end', () => res.end());
      return;
    }

    let data = '';
    proxyRes.on('data', chunk => { data += chunk; });
    proxyRes.on('end', () => {
      res.writeHead(statusCode, {
        'Content-Type': proxyRes.headers['content-type'] || 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(data);
    });
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy(Object.assign(new Error('Upstream request timed out'), { code: 'UPSTREAM_TIMEOUT' }));
  });

  proxyReq.on('error', error => {
    if (res.headersSent) {
      res.end();
      return;
    }
    const code = error.code === 'UPSTREAM_TIMEOUT' ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_ERROR';
    const statusCode = error.code === 'UPSTREAM_TIMEOUT' ? 504 : 502;
    console.error('Proxy error:', error.message);
    sendError(res, statusCode, code, code === 'UPSTREAM_TIMEOUT' ? 'Upstream request timed out' : 'Upstream request failed');
  });

  proxyReq.write(postData);
  proxyReq.end();
}

module.exports = {
  buildChatCompletionUrl,
  proxyToUpstream,
};
