const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

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
  const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf-8');
  vm.runInNewContext(`${source}\n${suffix}`, context);
  return source;
}

test('AI chat responses use the required content parser', () => {
  const context = createFrontendContext();
  const source = loadApp(context);

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
  assert.equal(source.includes('data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content ||'), false);
  assert.equal(source.includes('resData.choices?.[0]?.message?.content'), false);
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
