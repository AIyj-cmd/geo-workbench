const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { createServer, validateChatPayload, buildChatCompletionUrl } = require('../server');
const { createRateLimiter } = require('../src/http/rate-limit');

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

    const stateStorage = await request(port, { path: '/src/frontend/state-storage.js?v=1' });
    assert.equal(stateStorage.statusCode, 200);
    assert.match(stateStorage.headers['content-type'], /application\/javascript/);
    assert.match(stateStorage.body, /GeoStateStorage/);

    const aiClient = await request(port, { path: '/src/frontend/ai-client.js?v=1' });
    assert.equal(aiClient.statusCode, 200);
    assert.match(aiClient.headers['content-type'], /application\/javascript/);
    assert.match(aiClient.body, /GeoAIClient/);

    const exportClient = await request(port, { path: '/src/frontend/export-client.js?v=1' });
    assert.equal(exportClient.statusCode, 200);
    assert.match(exportClient.headers['content-type'], /application\/javascript/);
    assert.match(exportClient.body, /GeoExportClient/);

    const uiUtils = await request(port, { path: '/src/frontend/ui-utils.js?v=1' });
    assert.equal(uiUtils.statusCode, 200);
    assert.match(uiUtils.headers['content-type'], /application\/javascript/);
    assert.match(uiUtils.body, /GeoUIUtils/);

    const dashboardRenderer = await request(port, { path: '/src/frontend/dashboard-renderer.js?v=1' });
    assert.equal(dashboardRenderer.statusCode, 200);
    assert.match(dashboardRenderer.headers['content-type'], /application\/javascript/);
    assert.match(dashboardRenderer.body, /GeoDashboardRenderer/);

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

test('package main points to the server module', () => {
  const pkg = require('..');
  assert.equal(typeof pkg.createServer, 'function');
});

test('GET /api/titles/pool falls back to bundled data/all_titles.txt', async () => {
  const previousDir = process.env.KEYWORD_TITLE_OUTPUTS_DIR;
  delete process.env.KEYWORD_TITLE_OUTPUTS_DIR;

  const server = createServer();
  const port = await listen(server);

  try {
    const selectedRes = await request(port, { path: '/api/titles/selected' });
    assert.equal(selectedRes.statusCode, 200);
    assert.equal(JSON.parse(selectedRes.body).total, 195);

    const res = await request(port, { path: '/api/titles/pool?size=10' });
    assert.equal(res.statusCode, 200);

    const body = JSON.parse(res.body);
    assert.ok(body.total > 0);
    assert.equal(body.titles.length, 10);
    assert.equal(body.source.type, 'aggregate_file');
    assert.equal(body.source.name, 'data/all_titles.txt');
  } finally {
    if (previousDir === undefined) delete process.env.KEYWORD_TITLE_OUTPUTS_DIR;
    else process.env.KEYWORD_TITLE_OUTPUTS_DIR = previousDir;
    await close(server);
  }
});

test('GET /api/titles/pool supports KEYWORD_TITLE_OUTPUTS_DIR all_titles.txt', async () => {
  const previousDir = process.env.KEYWORD_TITLE_OUTPUTS_DIR;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'geo-title-pool-'));
  fs.writeFileSync(path.join(tempDir, 'all_titles.txt'), '自定义标题 A\n自定义标题 B\n', 'utf-8');
  process.env.KEYWORD_TITLE_OUTPUTS_DIR = tempDir;

  const server = createServer();
  const port = await listen(server);

  try {
    const res = await request(port, { path: '/api/titles/pool?size=10' });
    assert.equal(res.statusCode, 200);

    const body = JSON.parse(res.body);
    assert.equal(body.total, 2);
    assert.deepEqual(body.titles.map(t => t.title), ['自定义标题 A', '自定义标题 B']);
    assert.equal(body.source.type, 'aggregate_file');
  } finally {
    if (previousDir === undefined) delete process.env.KEYWORD_TITLE_OUTPUTS_DIR;
    else process.env.KEYWORD_TITLE_OUTPUTS_DIR = previousDir;
    fs.rmSync(tempDir, { recursive: true, force: true });
    await close(server);
  }
});

test('rate limiter ignores x-forwarded-for unless trustProxy is enabled', () => {
  const req = (remoteAddress, forwardedFor) => ({
    headers: forwardedFor ? { 'x-forwarded-for': forwardedFor } : {},
    socket: { remoteAddress },
  });

  const defaultLimiter = createRateLimiter({ rateLimitMax: 1, rateLimitWindowMs: 60000 });
  assert.equal(defaultLimiter(req('10.0.0.1', '203.0.113.10')).allowed, true);
  assert.equal(defaultLimiter(req('10.0.0.1', '203.0.113.11')).allowed, false);

  const proxyLimiter = createRateLimiter({ rateLimitMax: 1, rateLimitWindowMs: 60000, trustProxy: true });
  assert.equal(proxyLimiter(req('10.0.0.1', '203.0.113.10')).allowed, true);
  assert.equal(proxyLimiter(req('10.0.0.1', '203.0.113.11')).allowed, true);
});

test('rate limiter can clean expired buckets', () => {
  const limiter = createRateLimiter({ rateLimitMax: 1, rateLimitWindowMs: 5 });
  assert.equal(limiter({ headers: {}, socket: { remoteAddress: '10.0.0.2' } }).allowed, true);
  assert.equal(limiter._bucketCount(), 1);

  limiter._cleanup(Date.now() + 10);
  assert.equal(limiter._bucketCount(), 0);
});

test('frontend helpers escape dangerous title text and save platform edits by data-platform', () => {
  const stateStorageSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'state-storage.js'), 'utf-8');
  const aiClientSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'ai-client.js'), 'utf-8');
  const exportClientSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'export-client.js'), 'utf-8');
  const uiUtilsSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'ui-utils.js'), 'utf-8');
  const dashboardRendererSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'dashboard-renderer.js'), 'utf-8');
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf-8');
  const context = {
    console: { ...console, warn: () => {} },
    document: {
      documentElement: {
        getAttribute: () => 'light',
        setAttribute: () => {},
      },
      addEventListener: () => {},
      getElementById: () => null,
      querySelectorAll: () => [],
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
  };
  vm.runInNewContext(`${stateStorageSource}\n${aiClientSource}\n${exportClientSource}\n${uiUtilsSource}\n${dashboardRendererSource}\n${source}`, context);

  assert.equal(context.escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
  assert.equal(context.escapeHtml('hello "world" & `test`'), 'hello &quot;world&quot; &amp; &#96;test&#96;');
  assert.equal(context.escapeHtml('line1\nline2'), 'line1\nline2');
  assert.equal(
    context.extractChatMessageContent({ choices: [{ message: { content: 'ok', reasoning_content: 'hidden' } }] }),
    'ok'
  );
  assert.throws(() => context.requireGeneratedContent('', '平台生成'), /返回空内容/);
  assert.equal(source.includes('onclick="generateArticleFromTitle(\'${t.title'), false);
  assert.equal(source.includes('onclick="addToSelected(\'${t.title'), false);
  assert.equal(source.includes('onclick="selectFromTitleLib'), false);
  assert.equal(source.includes('onclick="selectWorkspaceQuestion(\'${q.id}'), false);
  assert.equal(source.includes('<div class="title-lib-text">${q.question}</div>'), false);
  assert.equal(source.includes('<div class="workspace-q-text">${q.question}</div>'), false);

  const registry = context.getPlatformRegistry();
  const registryNames = Array.from(registry, platform => platform.name);
  const registryKeys = Array.from(registry, platform => platform.key);
  const distributionKeys = Array.from(context.getDistributionPlatforms(), platform => platform.key);
  const titlePromptKeys = Array.from(context.getPlatformTitleEntries(), ([key]) => key);
  assert.equal(registry.length, 8);
  assert.deepEqual(
    registryNames,
    ['知乎', '公众号', '百家号', 'B站', '搜狐', '网易', '今日头条', '腾讯新闻']
  );
  assert.equal(new Set(registryKeys).size, 8);
  assert.equal(new Set(registryNames).size, 8);
  assert.equal(context.getDistributionPlatforms().length, registry.length);
  assert.equal(context.getPlatformTitleEntries().length, registry.length);
  assert.deepEqual(distributionKeys, registryKeys);
  assert.deepEqual(titlePromptKeys, registryKeys);
  const removedPlatforms = new Set(['小红书', '抖音', '视频号', '官网']);
  registry.flatMap(platform => [platform.name, ...(platform.aliases || [])]).forEach(name => {
    assert.equal(removedPlatforms.has(name), false);
  });

  assert.equal(context.getPlatformKey('网易号'), 'netease');
  assert.equal(context.getPlatformDisplayName('网易号'), '网易');
  assert.equal(context.getPlatformContent({ platforms: { '网易号': 'legacy netease' } }, 'netease'), 'legacy netease');

  const article = { platforms: { '知乎': 'old zhihu', '网易号': 'old netease' } };
  const textareas = [
    { dataset: { platform: '网易号', platformKey: 'netease' }, value: 'new netease' },
    { dataset: { platform: '知乎', platformKey: 'zhihu' }, value: 'new zhihu' },
    { dataset: { platform: '未知平台', platformKey: 'unknown' }, value: 'should not save' },
  ];
  const saved = context.savePlatformTextareaValues(article, textareas);
  assert.equal(saved, 2);
  assert.equal(article.platforms.netease, 'new netease');
  assert.equal(article.platforms.zhihu, 'new zhihu');
  assert.equal(article.platforms['未知平台'], undefined);
  assert.equal(context.getPlatformContent(article, '网易号'), 'new netease');
});
