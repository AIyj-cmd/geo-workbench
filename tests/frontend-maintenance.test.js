const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const aiClient = require('../src/frontend/ai-client');
const exportClient = require('../src/frontend/export-client');
const stateStorage = require('../src/frontend/state-storage');
const uiUtils = require('../src/frontend/ui-utils');
const dashboardRenderer = require('../src/frontend/dashboard-renderer');
const articlesRenderer = require('../src/frontend/articles-renderer');

function createFrontendContext(storage = {}) {
  return {
    console: { ...console, error: () => {}, warn: () => {} },
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
      getItem: key => (Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null),
      setItem: (key, value) => { storage[key] = value; },
      removeItem: key => { delete storage[key]; },
    },
  };
}

function loadApp(context, suffix = '') {
  const stateStorageSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'state-storage.js'), 'utf-8');
  const aiClientSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'ai-client.js'), 'utf-8');
  const exportClientSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'export-client.js'), 'utf-8');
  const uiUtilsSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'ui-utils.js'), 'utf-8');
  const dashboardRendererSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'dashboard-renderer.js'), 'utf-8');
  const articlesRendererSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'articles-renderer.js'), 'utf-8');
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf-8');
  vm.runInNewContext(`${stateStorageSource}\n${aiClientSource}\n${exportClientSource}\n${uiUtilsSource}\n${dashboardRendererSource}\n${articlesRendererSource}\n${source}\n${suffix}`, context);
  return source;
}

test('ai-client module parses required chat content', () => {
  assert.equal(
    aiClient.extractChatMessageContent({ choices: [{ message: { content: '  generated  ' } }] }),
    '  generated  '
  );
  assert.equal(aiClient.extractChatMessageContent({}), '');
  assert.equal(aiClient.extractChatMessageContent({ choices: [{}] }), '');
  assert.throws(
    () => aiClient.extractRequiredChatContent({ choices: [{ message: { content: '' } }] }, 'empty-unit'),
    /empty-unit/
  );
  assert.throws(
    () => aiClient.extractRequiredChatContent({ choices: [{ message: { content: '   ' } }] }, 'blank-unit'),
    /blank-unit/
  );
  assert.equal(
    aiClient.extractRequiredChatContent({ choices: [{ message: { content: '  generated  ' } }] }, 'trim-unit'),
    'generated'
  );
});

test('app delegates AI chat parsing to GeoAIClient', () => {
  const context = createFrontendContext();
  const source = loadApp(context);
  const aiClientSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'ai-client.js'), 'utf-8');

  assert.equal(
    context.extractRequiredChatContent({ choices: [{ message: { content: '  generated  ' } }] }, 'unit'),
    'generated'
  );
  assert.throws(
    () => context.extractRequiredChatContent({ choices: [{ message: { content: '   ' } }] }, 'empty-unit'),
    /empty-unit/
  );
  assert.throws(
    () => context.extractRequiredChatContent({ choices: [{ message: { reasoning_content: 'hidden' } }] }, 'missing-unit'),
    /missing-unit/
  );

  assert.ok((source.match(/extractRequiredChatContent/g) || []).length >= 5);
  assert.equal(source.includes('choices[0].message.content'), false);
  assert.equal(source.includes('choices?.[0]?.message?.content'), false);
  assert.match(aiClientSource, /root\.GeoAIClient = api/);
  assert.match(aiClientSource, /choices\[0\]\.message\.content/);
  assert.equal(context.GeoAIClient.extractRequiredChatContent({ choices: [{ message: { content: ' ok ' } }] }, 'window-unit'), 'ok');
});

test('export-client module builds Word exports safely', () => {
  const exportClientSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'export-client.js'), 'utf-8');
  const context = {};
  vm.runInNewContext(exportClientSource, context);

  assert.equal(typeof exportClient.exportToWord, 'function');
  assert.equal(typeof context.GeoExportClient, 'object');
  assert.equal(exportClient.sanitizeFilename('a/b\\c:d*e?f"g<h>i|j'), 'a_b_c_d_e_f_g_h_i_j');
  assert.equal(exportClient.exportToWord('', 'draft', mockDownloadEnv()).filename, '.doc');

  const masterHtml = exportClient.buildMasterDraftWordHtml({ title: '母稿', content: '# 标题\n母稿正文' });
  assert.match(masterHtml, /母稿正文/);

  const platformNames = ['知乎', '公众号', '百家号', 'B站', '搜狐', '网易', '今日头条', '腾讯新闻'];
  const platforms = platformNames.map(name => ({
    icon: '📄',
    platform: name,
    form: '文章',
    length: '800字',
    geoValue: 'GEO',
    content: `${name}内容`,
  }));
  const distributionHtml = exportClient.buildDistributionWordHtml({
    title: '一稿多发',
    article: { content: '母稿正文' },
    platforms,
  });
  for (const name of platformNames) {
    assert.match(distributionHtml, new RegExp(name));
  }

  const emptyPlatformHtml = exportClient.buildDistributionWordHtml({
    title: null,
    article: { content: null },
    platforms: [{ platform: '知乎', content: null }],
  });
  assert.doesNotThrow(() => exportClient.buildAllArticlesWordHtml({
    articles: [{ title: null, article: { id: 1, content: null }, platformEntries: [{ platform: '知乎', content: null }] }],
  }));
  assert.equal(/\bundefined\b|\bnull\b/.test(emptyPlatformHtml), false);
});

test('app delegates Word export formatting to GeoExportClient', () => {
  const context = createFrontendContext();
  const source = loadApp(context);
  const exportClientSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'export-client.js'), 'utf-8');

  assert.match(exportClientSource, /root\.GeoExportClient = api/);
  assert.equal(source.includes("application/msword"), false);
  assert.equal(source.includes("new Blob([fullHtml]"), false);
  assert.equal(source.includes("body { font-family: 'Microsoft YaHei'"), false);
  assert.equal(/apiKey|MIMO_API_KEY|config\.json/.test(exportClientSource), false);
  assert.equal(context.GeoExportClient.sanitizeFilename('x/y'), 'x_y');
});

test('ui-utils module creates safe DOM helpers and gated debug logging', async () => {
  const uiUtilsSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'ui-utils.js'), 'utf-8');
  const context = {};
  vm.runInNewContext(uiUtilsSource, context);

  assert.equal(typeof uiUtils.createOption, 'function');
  assert.equal(typeof context.GeoUIUtils, 'object');

  const documentRef = mockDomDocument();
  const dangerousText = '<img src=x onerror=alert(1)>';
  const element = uiUtils.createElement('span', { documentRef, text: dangerousText });
  assert.equal(element.textContent, dangerousText);
  assert.equal(element.innerHTML, undefined);

  const option = uiUtils.createOption('value', 'hello "world"', true, { documentRef });
  assert.equal(option.value, 'value');
  assert.equal(option.textContent, 'hello "world"');
  assert.equal(option.selected, true);

  const parent = documentRef.createElement('div');
  uiUtils.appendChildren(parent, [element, option]);
  assert.equal(parent.children.length, 2);
  uiUtils.clearElement(parent);
  assert.equal(parent.children.length, 0);

  assert.equal(uiUtils.isDebugEnabled({ storage: { getItem: () => null } }), false);
  assert.equal(uiUtils.isDebugEnabled({ storage: { getItem: () => '1' } }), true);
  const disabledLogs = [];
  vm.runInNewContext(`${uiUtilsSource}\nGeoUIUtils.debugLog('hidden');`, {
    localStorage: { getItem: () => null },
    console: { debug: (...args) => disabledLogs.push(args) },
  });
  assert.deepEqual(disabledLogs, []);
  const enabledLogs = [];
  vm.runInNewContext(`${uiUtilsSource}\nGeoUIUtils.debugLog('visible', 1);`, {
    localStorage: { getItem: () => '1' },
    console: { debug: (...args) => enabledLogs.push(args) },
  });
  assert.deepEqual(enabledLogs, [['visible', 1]]);

  assert.equal(await uiUtils.copyToClipboard('copy text', { navigatorRef: {}, documentRef: null }), false);
  const fallbackDocument = mockDomDocument();
  fallbackDocument.body = fallbackDocument.createElement('body');
  fallbackDocument.execCommand = command => command === 'copy';
  assert.equal(await uiUtils.copyToClipboard('copy text', {
    navigatorRef: { clipboard: { writeText: async () => { throw new Error('denied'); } } },
    documentRef: fallbackDocument,
  }), true);
});

test('dashboard-renderer module builds stable stats and renders dangerous text safely', () => {
  const uiUtilsSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'ui-utils.js'), 'utf-8');
  const dashboardRendererSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'dashboard-renderer.js'), 'utf-8');
  const context = {};
  vm.runInNewContext(`${uiUtilsSource}\n${dashboardRendererSource}`, context);

  assert.equal(typeof dashboardRenderer.renderDashboard, 'function');
  assert.equal(typeof dashboardRenderer.buildDashboardStats, 'function');
  assert.equal(typeof context.GeoDashboardRenderer, 'object');
  assert.match(dashboardRendererSource, /root\.GeoDashboardRenderer = api/);

  const dangerousText = '<img src=x onerror=alert(1)>';
  const state = {
    questions: [{
      id: 1,
      question: dangerousText,
      priority: '高',
      intent: '决策选型',
      status: '未开始',
      industry: '通用',
      cluster: dangerousText,
      sellingPoint: dangerousText,
      retestDate: '2099-01-01',
      mentioned: '是',
    }],
    articles: [{
      questionId: 1,
      createdAt: new Date().toISOString(),
      angle: 'angle-1',
      angleName: dangerousText,
      platforms: { zhihu: 'platform content' },
    }],
    testRecords: [{
      questionId: 1,
      testDate: '2099-01-01',
      mentioned: '是',
      competitors: dangerousText,
    }],
  };
  const options = {
    titleTabState: { selectedTitles: [{ title: 'selected' }], poolTotal: 9 },
    platforms: [{ key: 'zhihu', platform: '知乎' }],
    angles: [{ id: 'angle-1', name: dangerousText }],
    getArticlePlatformEntries: article => Object.entries(article.platforms || {}).map(([key, content]) => ({ key, platform: key, content })),
    hasPlatformContent: (article, platform) => !!(article.platforms && article.platforms[platform.key]),
  };

  const stats = dashboardRenderer.buildDashboardStats(state, options);
  assert.equal(stats.selectedCount, 1);
  assert.equal(stats.poolTotal, 9);
  assert.equal(stats.generatedCount, 1);
  assert.equal(stats.platformVersions, 1);
  assert.equal(stats.mentionRate, 100);
  assert.equal(stats.topCompetitors[0][0], dangerousText);

  const emptyStats = dashboardRenderer.buildDashboardStats({}, {});
  assert.equal(emptyStats.questionCount, 0);
  assert.equal(emptyStats.generatedCount, 0);
  assert.equal(emptyStats.mentionRate, 0);

  const documentRef = mockDashboardDocument();
  assert.doesNotThrow(() => dashboardRenderer.renderDashboard({
    ...options,
    documentRef,
    ui: uiUtils,
    state,
    storage: { getItem: () => null, setItem: () => {} },
  }));

  const statsEl = documentRef.getElementById('dashboardStats');
  const chartsEl = documentRef.getElementById('dashboardCharts');
  assert.ok(statsEl.children.length > 0);
  assert.ok(chartsEl.children.length > 0);
  const renderedText = collectDomText(statsEl) + collectDomText(chartsEl);
  const renderedHtml = collectDomInnerHtml(statsEl) + collectDomInnerHtml(chartsEl);
  assert.ok(renderedText.includes(dangerousText));
  assert.equal(renderedHtml.includes(dangerousText), false);
  assert.equal(/\bundefined\b|\bnull\b/.test(renderedText), false);

  const missingFieldDocument = mockDashboardDocument();
  assert.doesNotThrow(() => dashboardRenderer.renderDashboard({
    documentRef: missingFieldDocument,
    ui: uiUtils,
    state: { questions: 'bad', articles: null, testRecords: undefined },
    titleTabState: {},
    platforms: [],
    angles: [],
    storage: { getItem: () => '{bad json', setItem: () => {} },
  }));
});

test('articles-renderer module filters, sorts, and renders article rows safely', () => {
  const uiUtilsSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'ui-utils.js'), 'utf-8');
  const articlesRendererSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'articles-renderer.js'), 'utf-8');
  const context = {};
  vm.runInNewContext(`${uiUtilsSource}\n${articlesRendererSource}`, context);

  assert.equal(typeof articlesRenderer.renderArticles, 'function');
  assert.equal(typeof articlesRenderer.buildArticleRows, 'function');
  assert.equal(typeof context.GeoArticlesRenderer, 'object');
  assert.match(articlesRendererSource, /root\.GeoArticlesRenderer = api/);

  const dangerousText = '<img src=x onerror=alert(1)>';
  const state = {
    questions: [
      { id: 1, question: dangerousText },
      { id: 2, question: 'safe question' },
    ],
    articles: [
      {
        id: 1,
        questionId: 1,
        content: 'older content',
        model: 'mimo-v2.5',
        angle: 'faq',
        angleName: dangerousText,
        platforms: { zhihu: '知乎内容', '网易': '网易内容' },
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        questionId: 2,
        content: 'newer searchable content',
        model: null,
        platforms: {},
        updatedAt: '2026-02-01T00:00:00.000Z',
      },
      {
        id: 3,
        content: null,
        updatedAt: 'bad-date',
      },
    ],
  };
  const platforms = [
    { key: 'zhihu', platform: '知乎' },
    { key: 'netease', platform: '网易' },
  ];

  const allRows = articlesRenderer.buildArticleRows(state, { platforms });
  assert.deepEqual(allRows.map(row => row.article.id), [2, 1, 3]);
  assert.equal(allRows[1].platformCount, 2);
  assert.deepEqual(allRows[1].platforms.map(platform => [platform.label, platform.hasContent]), [
    ['知乎', true],
    ['网易', true],
  ]);

  const searchRows = articlesRenderer.buildArticleRows(state, { platforms, search: 'searchable' });
  assert.deepEqual(searchRows.map(row => row.article.id), [2]);
  const hasPlatformRows = articlesRenderer.buildArticleRows(state, { platforms, filterStatus: 'has-platforms' });
  assert.deepEqual(hasPlatformRows.map(row => row.article.id), [1]);
  const angleRows = articlesRenderer.buildArticleRows(state, { platforms, filterAngle: '_default' });
  assert.deepEqual(angleRows.map(row => row.article.id), [2, 3]);

  const emptyDocument = mockArticlesDocument();
  articlesRenderer.renderArticles({
    documentRef: emptyDocument,
    ui: uiUtils,
    state: { questions: [], articles: [] },
    platforms,
    angles: [{ id: 'faq', icon: 'Q', name: 'FAQ' }],
    actions: { navigateToWorkspace: () => {} },
  });
  assert.ok(collectDomText(emptyDocument.getElementById('articlesTable')).includes('暂无文稿'));
  assert.equal(/\bundefined\b|\bnull\b/.test(collectDomText(emptyDocument.getElementById('articlesTable'))), false);

  const documentRef = mockArticlesDocument();
  assert.doesNotThrow(() => articlesRenderer.renderArticles({
    documentRef,
    ui: uiUtils,
    state,
    platforms,
    angles: [{ id: 'faq', icon: 'Q', name: 'FAQ' }],
    actions: {
      navigateToWorkspace: () => {},
      viewArticle: () => {},
      exportArticleWord: () => {},
      deleteArticle: () => {},
      toggleAllArticleCheckboxes: () => {},
    },
  }));

  const tableText = collectDomText(documentRef.getElementById('articlesTable'));
  const tableHtml = collectDomInnerHtml(documentRef.getElementById('articlesTable'));
  assert.ok(tableText.includes(dangerousText));
  assert.ok(tableText.includes('知乎'));
  assert.ok(tableText.includes('网易'));
  assert.ok(tableText.includes('2/2'));
  assert.equal(tableHtml.includes(dangerousText), false);
  assert.equal(/\bundefined\b|\bnull\b/.test(tableText), false);
});

test('user-controlled frontend render paths avoid inline handler and textarea HTML insertion', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf-8');
  const dashboardRendererSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'dashboard-renderer.js'), 'utf-8');
  const articlesRendererSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'frontend', 'articles-renderer.js'), 'utf-8');

  assert.equal(source.includes('onclick="generateArticleFromTitle(\'${t.title'), false);
  assert.equal(source.includes('onclick="addToSelected(\'${t.title'), false);
  assert.equal(source.includes('onclick="selectFromTitleLib'), false);
  assert.equal(source.includes('onclick="selectWorkspaceQuestion(\'${q.id}'), false);
  assert.equal(source.includes('onclick="copyPTTitles'), false);
  assert.equal(source.includes('data-title="${escapeHtml(t)}"'), false);
  assert.equal(source.includes('innerHTML += `'), false);
  assert.equal(source.includes('ta.innerHTML ='), false);
  assert.equal(source.includes('qSelect.innerHTML = state.questions.map'), false);
  assert.equal(source.includes("select.innerHTML = '<option value=\"\">"), false);
  assert.equal(source.includes('console.log(`[${platform}] Prompt length'), false);
  assert.equal(source.includes('console.log(`[${platform}] Raw lines'), false);
  assert.equal(source.includes('console.log(`[PlatformTitles] Retrying'), false);
  assert.match(source, /function debugLog\(\.\.\.args\)/);
  assert.match(source, /geoUIUtils\.createOption/);
  assert.match(source, /geoDashboardRenderer\.renderDashboard/);
  assert.match(source, /geoArticlesRenderer\.renderArticles/);
  assert.equal(source.includes('dashboardCardOrder'), false);
  assert.equal(source.includes('dash-trend-chart'), false);
  assert.equal(source.includes('dash-matrix-wrapper'), false);
  assert.equal(source.includes('let html = `<table class="table"><thead><tr>'), false);
  assert.equal(source.includes('onclick="viewArticle(${a.id})'), false);
  assert.equal(dashboardRendererSource.includes('onclick='), false);
  assert.equal(dashboardRendererSource.includes('innerHTML = cardOrder.map'), false);
  assert.equal(articlesRendererSource.includes('onclick='), false);
  assert.equal(articlesRendererSource.includes('innerHTML'), false);
});

function mockDownloadEnv() {
  return {
    BlobCtor: function MockBlob(parts, options) {
      this.parts = parts;
      this.options = options;
    },
    URLRef: {
      createObjectURL: () => 'blob:mock',
      revokeObjectURL: () => {},
    },
    documentRef: {
      createElement: () => ({
        click: () => {},
      }),
    },
  };
}

function mockDomDocument() {
  return {
    createElement: tagName => {
      const element = {
        tagName: String(tagName).toUpperCase(),
        children: [],
        firstChild: null,
        dataset: {},
        style: {},
        attributes: {},
        options: [],
        listeners: {},
        textContent: '',
        value: '',
        selected: false,
        appendChild(child) {
          this.children.push(child);
          if (child && child.tagName === 'OPTION') this.options.push(child);
          this.firstChild = this.children[0] || null;
          return child;
        },
        removeChild(child) {
          const index = this.children.indexOf(child);
          if (index >= 0) this.children.splice(index, 1);
          const optionIndex = this.options.indexOf(child);
          if (optionIndex >= 0) this.options.splice(optionIndex, 1);
          this.firstChild = this.children[0] || null;
          return child;
        },
        setAttribute(name, value) {
          this.attributes[name] = value;
        },
        addEventListener(name, handler) {
          this.listeners[name] = handler;
        },
      };
      return element;
    },
  };
}

function mockDashboardDocument() {
  const base = mockDomDocument();
  const elements = {
    dashboardStats: base.createElement('div'),
    dashboardCharts: base.createElement('div'),
  };
  return {
    ...base,
    getElementById: id => elements[id] || null,
    querySelectorAll: () => [],
  };
}

function mockArticlesDocument() {
  const base = mockDomDocument();
  const angleSelect = base.createElement('select');
  angleSelect.options.push(base.createElement('option'));
  const elements = {
    articleSearch: base.createElement('input'),
    articleFilterStatus: base.createElement('select'),
    articleFilterAngle: angleSelect,
    articleCount: base.createElement('span'),
    articlesTable: base.createElement('div'),
  };
  return {
    ...base,
    getElementById: id => elements[id] || null,
    querySelectorAll: () => [],
  };
}

function collectDomText(element) {
  if (!element) return '';
  return `${element.textContent || ''}${(element.children || []).map(collectDomText).join('')}`;
}

function collectDomInnerHtml(element) {
  if (!element) return '';
  return `${element.innerHTML || ''}${(element.children || []).map(collectDomInnerHtml).join('')}`;
}

test('state migration preserves legacy data and localStorage saves version', () => {
  const storage = { geo_workbench_data: '{bad json' };
  const context = createFrontendContext(storage);
  loadApp(context);

  const migrated = context.migrateState({
    questions: [{ id: 999, question: 'legacy question' }],
    articles: [{ id: 7, content: 'legacy article' }],
    nextArticleId: '8',
    selectedQuestionIds: [999],
  });

  assert.equal(migrated.version, 1);
  assert.deepEqual(migrated.questions, [{ id: 999, question: 'legacy question' }]);
  assert.deepEqual(migrated.articles, [{ id: 7, content: 'legacy article' }]);
  assert.equal(migrated.nextArticleId, 8);
  assert.equal(migrated.selectedQuestionIds.has(999), true);
  assert.ok(Array.isArray(migrated.sellingPoints));
  assert.ok(migrated.sellingPoints.length > 0);
  assert.equal(migrated.batchRunning, false);

  const repaired = context.migrateState({ questions: 'bad field' });
  assert.ok(Array.isArray(repaired.questions));
  assert.ok(repaired.questions.length > 0);

  assert.doesNotThrow(() => context.loadState());

  const saveStorage = {};
  loadApp(createFrontendContext(saveStorage), 'saveState();');
  assert.equal(JSON.parse(saveStorage.geo_workbench_data).version, 1);
});

test('state-storage module migrates, loads, and saves state safely', () => {
  assert.equal(stateStorage.STATE_VERSION, 1);

  const defaults = {
    defaultQuestions: [{ id: 1, question: 'default question' }],
    defaultSellingPoints: [{ id: 1, point: 'default selling point' }],
  };
  const defaultState = stateStorage.createDefaultState(defaults);
  assert.equal(defaultState.version, 1);
  assert.deepEqual(defaultState.questions, defaults.defaultQuestions);
  assert.deepEqual(defaultState.sellingPoints, defaults.defaultSellingPoints);
  assert.equal(defaultState.selectedQuestionIds instanceof Set, true);

  const legacy = stateStorage.migrateState({
    questions: [{ id: 2, question: 'legacy question' }],
    selectedQuestionIds: [2],
    nextArticleId: '9',
  }, defaults);
  assert.equal(legacy.version, 1);
  assert.deepEqual(legacy.questions, [{ id: 2, question: 'legacy question' }]);
  assert.equal(legacy.selectedQuestionIds.has(2), true);
  assert.equal(legacy.nextArticleId, 9);
  assert.deepEqual(legacy.sellingPoints, defaults.defaultSellingPoints);

  const broken = stateStorage.safeParseState('{bad json');
  assert.equal(broken.value, null);
  assert.ok(broken.error instanceof Error);

  const damagedStorage = { geo_workbench_data: '{bad json' };
  const damagedLoaded = stateStorage.loadState({
    getItem: key => damagedStorage[key] || null,
    setItem: (key, value) => { damagedStorage[key] = value; },
  }, defaults);
  assert.equal(damagedLoaded.error instanceof Error, true);
  assert.deepEqual(damagedLoaded.state.questions, defaults.defaultQuestions);

  const throwingLoaded = stateStorage.loadState({
    getItem: () => { throw new Error('storage unavailable'); },
  }, defaults);
  assert.equal(throwingLoaded.error instanceof Error, true);
  assert.deepEqual(throwingLoaded.state.questions, defaults.defaultQuestions);

  const saveStorage = {};
  const savedData = stateStorage.saveState({
    getItem: key => saveStorage[key] || null,
    setItem: (key, value) => { saveStorage[key] = value; },
  }, legacy, { selectedTitles: [{ title: 'saved title' }] });
  assert.equal(savedData.version, 1);
  assert.equal(JSON.parse(saveStorage.geo_workbench_data).version, 1);
  assert.deepEqual(JSON.parse(saveStorage.geo_workbench_data).selectedTitles, [{ title: 'saved title' }]);
});
