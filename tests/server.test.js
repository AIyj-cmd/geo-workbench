const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createServer, validateChatPayload, buildChatCompletionUrl } = require('../server');

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve(server.address().port);
    });
  });
}

function close(server) {
  return new Promise(resolve => server.close(resolve));
}

function request(port, options = {}) {
  const body = options.body === undefined ? undefined : (
    typeof options.body === 'string' ? options.body : JSON.stringify(options.body)
  );

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path: options.path || '/',
      method: options.method || 'GET',
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : {}),
        ...(options.headers || {}),
      },
    }, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (body !== undefined) req.write(body);
    req.end();
  });
}

test('GET /api/status reports server configuration without secrets', async () => {
  const server = createServer({ apiKey: 'secret', apiUrl: 'http://example.test/v1', allowedChatModels: ['mimo-v2.5'] });
  const port = await listen(server);

  try {
    const res = await request(port, { path: '/api/status' });
    assert.equal(res.statusCode, 200);

    const body = JSON.parse(res.body);
    assert.equal(body.configured, true);
    assert.equal(body.endpoint, 'http://example.test/v1');
    assert.deepEqual(body.chatModels, ['mimo-v2.5']);
    assert.equal(res.body.includes('secret'), false);
  } finally {
    await close(server);
  }
});

test('static file serving uses an allowlist and ignores query strings', async () => {
  const server = createServer();
  const port = await listen(server);

  try {
    const app = await request(port, { path: '/app.js?v=1' });
    assert.equal(app.statusCode, 200);
    assert.match(app.headers['content-type'], /application\/javascript/);

    const serverFile = await request(port, { path: '/server.js' });
    assert.equal(serverFile.statusCode, 404);

    const traversal = await request(port, { path: '/../server.js' });
    assert.equal(traversal.statusCode, 404);
  } finally {
    await close(server);
  }
});

test('validateChatPayload rejects unsupported models and unsafe parameters', () => {
  const config = { allowedChatModels: ['mimo-v2.5'] };

  assert.match(
    validateChatPayload({ model: 'mimo-v2.5-tts', messages: [{ role: 'user', content: 'hi' }] }, config).error,
    /model must be one of/
  );
  assert.match(
    validateChatPayload({ model: 'mimo-v2.5', messages: [{ role: 'user', content: 'hi' }], max_tokens: 70000 }, config).error,
    /max_tokens/
  );
  assert.match(
    validateChatPayload({ model: 'mimo-v2.5', messages: [{ role: 'tool', content: 'hi' }] }, config).error,
    /message.role/
  );
});

test('POST /api/chat sanitizes payload and proxies to chat completions', async () => {
  let upstreamRequest;
  const upstream = http.createServer((req, res) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      upstreamRequest = {
        method: req.method,
        url: req.url,
        authorization: req.headers.authorization,
        body: JSON.parse(data),
      };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ choices: [{ message: { content: 'ok' } }] }));
    });
  });
  const upstreamPort = await listen(upstream);
  const server = createServer({
    apiKey: 'secret',
    apiUrl: `http://127.0.0.1:${upstreamPort}/v1`,
    allowedChatModels: ['mimo-v2.5'],
  });
  const port = await listen(server);

  try {
    const res = await request(port, {
      path: '/api/chat',
      method: 'POST',
      body: {
        model: 'mimo-v2.5',
        messages: [{ role: 'user', content: 'hello' }],
        max_tokens: 100,
        temperature: 0.7,
        stream: false,
        ignored: 'drop me',
      },
    });

    assert.equal(res.statusCode, 200);
    assert.equal(upstreamRequest.method, 'POST');
    assert.equal(upstreamRequest.url, '/v1/chat/completions');
    assert.equal(upstreamRequest.authorization, 'Bearer secret');
    assert.equal(upstreamRequest.body.ignored, undefined);
    assert.equal(upstreamRequest.body.model, 'mimo-v2.5');
    assert.deepEqual(JSON.parse(res.body), { choices: [{ message: { content: 'ok' } }] });
  } finally {
    await close(server);
    await close(upstream);
  }
});

test('POST /api/chat enforces body size and rate limits', async () => {
  const server = createServer({
    apiKey: 'secret',
    apiUrl: 'http://127.0.0.1:9/v1',
    allowedChatModels: ['mimo-v2.5'],
    bodyLimitBytes: 10,
    rateLimitMax: 1,
    rateLimitWindowMs: 60000,
  });
  const port = await listen(server);

  try {
    const tooLarge = await request(port, { path: '/api/chat', method: 'POST', body: '{"tooLarge":true}' });
    assert.equal(tooLarge.statusCode, 413);

    const invalid = await request(port, { path: '/api/chat', method: 'POST', body: '{}' });
    assert.equal(invalid.statusCode, 429);
  } finally {
    await close(server);
  }
});

test('buildChatCompletionUrl preserves base paths', () => {
  assert.equal(buildChatCompletionUrl('https://example.test/v1').toString(), 'https://example.test/v1/chat/completions');
  assert.equal(buildChatCompletionUrl('https://example.test/v1/').toString(), 'https://example.test/v1/chat/completions');
});
