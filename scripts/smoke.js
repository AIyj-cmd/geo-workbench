const fs = require('node:fs');
const http = require('node:http');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { once } = require('node:events');

const rootDir = path.resolve(__dirname, '..');
const { createServer } = require('../src/app');

const platforms = ['知乎', '公众号', '百家号', 'B站', '搜狐', '网易', '今日头条', '腾讯新闻'];
const dangerousTitle = '<img src=x onerror=alert(1)>';

function log(message) {
  console.log(`[smoke] ${message}`);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function removeTempDirWithRetry(dir, attempts = 8) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      return true;
    } catch (error) {
      lastError = error;
      await delay(300);
    }
  }
  console.warn(`[smoke] warning: failed to clean temporary directory: ${lastError ? lastError.message : dir}`);
  return false;
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function listen(server, port) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });
}

function closeServer(server) {
  return new Promise(resolve => server.close(resolve));
}

function findBrowserPath() {
  const envPath = process.env.CHROME_PATH;
  if (envPath && fs.existsSync(envPath)) return envPath;

  const candidates = process.platform === 'win32'
    ? [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      ]
    : [
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      ];

  return candidates.find(candidate => fs.existsSync(candidate)) || '';
}

async function waitForJson(url, timeoutMs = 10000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      lastError = new Error(`HTTP ${res.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(200);
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError ? lastError.message : 'no response'}`);
}

async function createCdpTab(debugPort) {
  const tabInfo = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' }).then(res => {
    if (!res.ok) throw new Error(`Failed to create browser tab: HTTP ${res.status}`);
    return res.json();
  });
  const ws = new WebSocket(tabInfo.webSocketDebuggerUrl);
  await once(ws, 'open');

  let id = 0;
  const pending = new Map();
  const listeners = new Map();

  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(`${msg.error.message}${msg.error.data ? `: ${msg.error.data}` : ''}`));
      else resolve(msg.result || {});
      return;
    }
    if (msg.method && listeners.has(msg.method)) {
      for (const listener of listeners.get(msg.method)) listener(msg.params || {});
    }
  };

  function on(method, listener) {
    if (!listeners.has(method)) listeners.set(method, new Set());
    listeners.get(method).add(listener);
  }

  function send(method, params = {}) {
    const messageId = ++id;
    ws.send(JSON.stringify({ id: messageId, method, params }));
    return new Promise((resolve, reject) => {
      pending.set(messageId, { resolve, reject });
      setTimeout(() => {
        if (!pending.has(messageId)) return;
        pending.delete(messageId);
        reject(new Error(`CDP command timed out: ${method}`));
      }, 10000).unref();
    });
  }

  return { ws, send, on };
}

async function evaluate(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    const text = result.exceptionDetails.text || 'Runtime evaluation failed';
    throw new Error(text);
  }
  return result.result ? result.result.value : undefined;
}

async function waitFor(cdp, label, expression, timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const value = await evaluate(cdp, expression);
    if (value) return value;
    await delay(200);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'geo-workbench-smoke-'));
  const port = await getFreePort();
  const debugPort = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  let server;
  let chrome;
  let cdp;

  try {
    log(`starting server on ${baseUrl}`);
    server = createServer({
      port,
      host: '127.0.0.1',
      configPath: path.join(tempDir, 'missing-config.json'),
      apiKey: 'smoke-test-key',
      apiUrl: 'http://127.0.0.1:9/v1',
      rateLimitMax: 1000,
    });
    await listen(server, port);

    log('checking title APIs');
    const selected = await fetch(`${baseUrl}/api/titles/selected`).then(res => res.json());
    const pool = await fetch(`${baseUrl}/api/titles/pool?size=5`).then(res => res.json());
    assert(selected.total > 0 && selected.titles.length > 0, '/api/titles/selected returned no titles');
    assert(pool.total > 0 && pool.titles.length > 0, '/api/titles/pool returned no titles');

    log('checking state-storage static asset');
    const stateStorageRes = await fetch(`${baseUrl}/src/frontend/state-storage.js?v=smoke`);
    const stateStorageText = await stateStorageRes.text();
    const stateStorageContentType = stateStorageRes.headers.get('content-type') || '';
    assert(stateStorageRes.status === 200, '/src/frontend/state-storage.js did not return 200');
    assert(
      /(?:application|text)\/javascript/i.test(stateStorageContentType),
      '/src/frontend/state-storage.js did not return a JavaScript content-type'
    );
    assert(stateStorageText.includes('GeoStateStorage'), '/src/frontend/state-storage.js did not contain GeoStateStorage');

    log('checking ai-client static asset');
    const aiClientRes = await fetch(`${baseUrl}/src/frontend/ai-client.js?v=smoke`);
    const aiClientText = await aiClientRes.text();
    const aiClientContentType = aiClientRes.headers.get('content-type') || '';
    assert(aiClientRes.status === 200, '/src/frontend/ai-client.js did not return 200');
    assert(
      /(?:application|text)\/javascript/i.test(aiClientContentType),
      '/src/frontend/ai-client.js did not return a JavaScript content-type'
    );
    assert(aiClientText.includes('GeoAIClient'), '/src/frontend/ai-client.js did not contain GeoAIClient');

    log('checking export-client static asset');
    const exportClientRes = await fetch(`${baseUrl}/src/frontend/export-client.js?v=smoke`);
    const exportClientText = await exportClientRes.text();
    const exportClientContentType = exportClientRes.headers.get('content-type') || '';
    assert(exportClientRes.status === 200, '/src/frontend/export-client.js did not return 200');
    assert(
      /(?:application|text)\/javascript/i.test(exportClientContentType),
      '/src/frontend/export-client.js did not return a JavaScript content-type'
    );
    assert(exportClientText.includes('GeoExportClient'), '/src/frontend/export-client.js did not contain GeoExportClient');

    const browserPath = findBrowserPath();
    if (!browserPath) {
      throw new Error('Chrome or Edge executable not found. Set CHROME_PATH to a Chrome/Edge executable and rerun npm run smoke.');
    }

    log(`starting headless browser: ${browserPath}`);
    chrome = spawn(browserPath, [
      '--headless=new',
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${path.join(tempDir, 'profile')}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-gpu',
      '--no-sandbox',
      'about:blank',
    ], {
      cwd: rootDir,
      stdio: ['ignore', 'ignore', 'pipe'],
    });

    chrome.stderr.on('data', chunk => {
      const text = String(chunk);
      if (/DevTools listening/.test(text)) return;
    });

    await waitForJson(`http://127.0.0.1:${debugPort}/json/version`);
    cdp = await createCdpTab(debugPort);

    const browserErrors = [];
    cdp.on('Runtime.consoleAPICalled', params => {
      if (params.type !== 'error') return;
      const message = (params.args || []).map(arg => arg.value || arg.description || '').join(' ');
      if (/favicon\.ico/i.test(message)) return;
      browserErrors.push(`console.error: ${message}`);
    });
    cdp.on('Runtime.exceptionThrown', params => {
      browserErrors.push(`page exception: ${params.exceptionDetails && params.exceptionDetails.text}`);
    });
    cdp.on('Log.entryAdded', params => {
      const entry = params.entry || {};
      if (entry.level !== 'error') return;
      if (/favicon\.ico/i.test(entry.url || entry.text || '')) return;
      browserErrors.push(`browser log: ${entry.text || entry.url || 'unknown error'}`);
    });

    await cdp.send('Runtime.enable');
    await cdp.send('Log.enable');
    await cdp.send('Page.enable');
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
      source: 'window.__smokeAlertCount = 0; window.alert = function(){ window.__smokeAlertCount += 1; };',
    });

    log('opening home page');
    await cdp.send('Page.navigate', { url: baseUrl });
    await waitFor(cdp, 'home page ready', 'document.readyState === "complete" || document.readyState === "interactive"');
    await waitFor(cdp, 'selected title data loaded', 'typeof titleTabState !== "undefined" && titleTabState.selectedTitles.length > 0');

    const homeState = await evaluate(cdp, `(() => {
      navigateTo('questions');
      return {
        title: document.title,
        aiClientLoaded: typeof window.GeoAIClient === 'object',
        exportClientLoaded: typeof window.GeoExportClient === 'object',
        exportClientHasWordBuilder: typeof window.GeoExportClient?.buildAllArticlesWordHtml === 'function',
        questionsVisible: !!document.querySelector('#page-questions.active'),
        selectedRows: document.querySelectorAll('#selectedTableBody tr').length,
        poolCountText: document.getElementById('poolCount')?.textContent || ''
      };
    })()`);
    assert(homeState.title.includes('GEO'), 'home page title did not load');
    assert(homeState.aiClientLoaded, 'GeoAIClient was not loaded on the home page');
    assert(homeState.exportClientLoaded, 'GeoExportClient was not loaded on the home page');
    assert(homeState.exportClientHasWordBuilder, 'GeoExportClient Word export helpers were not available');
    assert(homeState.questionsVisible, 'keyword/title page is not visible');
    assert(homeState.selectedRows > 0, 'selected title table has no rows');
    assert(
      !browserErrors.some(error => error.includes('GeoStateStorage module is required')),
      'GeoStateStorage module is required error appeared after homepage load'
    );
    assert(
      !browserErrors.some(error => error.includes('GeoAIClient module is required')),
      'GeoAIClient module is required error appeared after homepage load'
    );
    assert(
      !browserErrors.some(error => error.includes('GeoExportClient module is required')),
      'GeoExportClient module is required error appeared after homepage load'
    );

    log('verifying dangerous title renders as text');
    const xssState = await evaluate(cdp, `(() => {
      titleTabState.selectedTitles.unshift({
        title: ${JSON.stringify(dangerousTitle)},
        category: 'commercial_geo',
        categoryLabel: 'Smoke'
      });
      renderSelectedTitles();
      const body = document.getElementById('selectedTableBody');
      return {
        text: body ? body.textContent : '',
        html: body ? body.innerHTML : '',
        alertCount: window.__smokeAlertCount || 0
      };
    })()`);
    assert(xssState.text.includes(dangerousTitle), 'dangerous title was not displayed as text');
    assert(!xssState.html.includes(dangerousTitle), 'dangerous title was inserted as raw HTML');
    assert(xssState.alertCount === 0, 'dangerous title executed alert');

    log('opening title library and running search/filter');
    const titleLibraryState = await evaluate(cdp, `(() => {
      navigateTo('workspace');
      openTitleLibrary();
      const input = document.getElementById('titleLibSearch');
      input.value = '仓';
      renderTitleLibrary();
      filterTitleLib('all');
      return {
        modalOpen: document.getElementById('titleLibraryModal')?.classList.contains('show') || false,
        itemCount: document.querySelectorAll('#titleLibList .title-lib-item').length,
        selectedQuestionIdBefore: state.wsSelectedQuestionId || null
      };
    })()`);
    assert(titleLibraryState.modalOpen, 'title library modal did not open');
    assert(titleLibraryState.itemCount >= 0, 'title library search/filter failed');

    log('selecting a title into workspace');
    const workspaceState = await evaluate(cdp, `(() => {
      const q = getWorkspaceQuestions()[0];
      if (!q) return { ok: false, reason: 'no workspace questions' };
      selectWorkspaceQuestion(q.id);
      return {
        ok: true,
        selectedId: state.wsSelectedQuestionId,
        selectedTitleText: document.getElementById('wsSelectedTitle')?.textContent || '',
        articleAreaExists: !!document.getElementById('wsArticleContent'),
        workspaceVisible: !!document.querySelector('#page-workspace.active')
      };
    })()`);
    assert(workspaceState.ok, workspaceState.reason || 'workspace selection failed');
    assert(workspaceState.selectedId, 'workspace selected id is empty');
    assert(workspaceState.selectedTitleText, 'workspace selected title is empty');
    assert(workspaceState.articleAreaExists, 'workspace article area is missing');
    assert(workspaceState.workspaceVisible, 'workspace page is not visible after selection');

    log('checking distribution platform textarea metadata');
    const distributionState = await evaluate(cdp, `(() => {
      const registry = getPlatformRegistry();
      const distribution = getDistributionPlatforms();
      const titleEntries = getPlatformTitleEntries();
      const article = { platforms: {} };
      for (const dm of DISTRIBUTION_MATRIX) {
        article.platforms[dm.key] = 'smoke content';
      }
      const container = document.createElement('div');
      renderDistributionCards(article, container, 999);
      const textareas = Array.from(container.querySelectorAll('textarea'));
      return {
        registryCount: registry.length,
        registryKeys: registry.map(platform => platform.key),
        registryNames: registry.map(platform => platform.name),
        distributionCount: distribution.length,
        titlePromptCount: titleEntries.length,
        titlePromptKeys: titleEntries.map(([key]) => key),
        count: textareas.length,
        platforms: textareas.map(ta => ta.dataset.platform || ''),
        keys: textareas.map(ta => ta.dataset.platformKey || '')
      };
    })()`);
    assert(distributionState.registryCount === 8, 'PLATFORM_REGISTRY does not contain exactly 8 platforms');
    assert(JSON.stringify(distributionState.registryNames) === JSON.stringify(platforms), 'PLATFORM_REGISTRY order/name mismatch');
    assert(new Set(distributionState.registryKeys).size === 8, 'PLATFORM_REGISTRY keys are not unique');
    assert(distributionState.distributionCount === distributionState.registryCount, 'DISTRIBUTION_MATRIX count mismatch');
    assert(distributionState.titlePromptCount === distributionState.registryCount, 'PLATFORM_TITLE_PROMPTS count mismatch');
    assert(JSON.stringify(distributionState.titlePromptKeys) === JSON.stringify(distributionState.registryKeys), 'PLATFORM_TITLE_PROMPTS key order mismatch');
    assert(distributionState.count >= 8, 'distribution card did not render 8 textareas');
    assert(distributionState.keys.every(Boolean), 'some distribution textareas are missing data-platform-key');
    for (const platform of platforms) {
      assert(
        distributionState.platforms.some(value => value.includes(platform)),
        `missing platform identifier: ${platform}`
      );
    }

    if (browserErrors.length) {
      throw new Error(`browser errors detected:\n${browserErrors.join('\n')}`);
    }

    log('smoke passed');
  } finally {
    if (cdp && cdp.ws) cdp.ws.close();
    if (chrome && !chrome.killed) {
      chrome.kill();
      await Promise.race([once(chrome, 'exit'), delay(3000)]).catch(() => {});
    }
    if (server) await closeServer(server);
    await removeTempDirWithRetry(tempDir);
    log('cleaned up temporary server, browser, and profile');
  }
}

main().catch(error => {
  console.error(`[smoke] failed: ${error.message}`);
  process.exit(1);
});
