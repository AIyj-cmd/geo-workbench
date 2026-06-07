const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const aiClient = require('../src/frontend/ai-client');
const stateStorage = require('../src/frontend/state-storage');

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
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf-8');
  vm.runInNewContext(`${stateStorageSource}\n${aiClientSource}\n${source}\n${suffix}`, context);
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

test('user-controlled frontend render paths avoid inline handler and textarea HTML insertion', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf-8');

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
});

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
