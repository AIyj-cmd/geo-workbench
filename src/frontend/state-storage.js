(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.GeoStateStorage = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const STATE_VERSION = 1;
  const DATA_STORAGE_KEY = 'geo_workbench_data';

  function clonePlainData(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function safeNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizeDefaults(options = {}) {
    return {
      questions: Array.isArray(options.defaultQuestions) ? options.defaultQuestions : [],
      sellingPoints: Array.isArray(options.defaultSellingPoints) ? options.defaultSellingPoints : [],
      nextQuestionId: safeNumber(options.nextQuestionId, 50),
      nextSpId: safeNumber(options.nextSpId, 15),
      nextArticleId: safeNumber(options.nextArticleId, 1),
      nextRecordId: safeNumber(options.nextRecordId, 1),
    };
  }

  function createDefaultState(options = {}) {
    const defaults = normalizeDefaults(options);
    return {
      version: STATE_VERSION,
      questions: clonePlainData(defaults.questions),
      sellingPoints: clonePlainData(defaults.sellingPoints),
      articles: [],
      selectedQuestionIds: new Set(),
      currentPage: 'questions',
      questionPage: 1,
      questionPageSize: 20,
      wsSelectedQuestionId: null,
      wsCurrentArticle: null,
      wsIsGenerating: false,
      wsAbortController: null,
      batchRunning: false,
      batchAbortController: null,
      nextQuestionId: defaults.nextQuestionId,
      nextSpId: defaults.nextSpId,
      nextArticleId: defaults.nextArticleId,
      testRecords: [],
      nextRecordId: defaults.nextRecordId,
      trPage: 1,
      trPageSize: 15,
    };
  }

  function migrateState(rawState, options = {}) {
    if (!rawState || typeof rawState !== 'object') {
      return createDefaultState(options);
    }

    const defaults = createDefaultState(options);
    const migrated = {
      ...defaults,
      ...rawState,
      version: STATE_VERSION,
      questions: Array.isArray(rawState.questions) ? rawState.questions : defaults.questions,
      sellingPoints: Array.isArray(rawState.sellingPoints) ? rawState.sellingPoints : defaults.sellingPoints,
      articles: Array.isArray(rawState.articles) ? rawState.articles : defaults.articles,
      testRecords: Array.isArray(rawState.testRecords) ? rawState.testRecords : defaults.testRecords,
      nextQuestionId: safeNumber(rawState.nextQuestionId, defaults.nextQuestionId),
      nextSpId: safeNumber(rawState.nextSpId, defaults.nextSpId),
      nextArticleId: safeNumber(rawState.nextArticleId, defaults.nextArticleId),
      nextRecordId: safeNumber(rawState.nextRecordId, defaults.nextRecordId),
      questionPage: safeNumber(rawState.questionPage, defaults.questionPage),
      questionPageSize: safeNumber(rawState.questionPageSize, defaults.questionPageSize),
      trPage: safeNumber(rawState.trPage, defaults.trPage),
      trPageSize: safeNumber(rawState.trPageSize, defaults.trPageSize),
      wsIsGenerating: false,
      wsAbortController: null,
      batchRunning: false,
      batchAbortController: null,
    };

    if (rawState.selectedQuestionIds instanceof Set) {
      migrated.selectedQuestionIds = new Set(rawState.selectedQuestionIds);
    } else if (Array.isArray(rawState.selectedQuestionIds)) {
      migrated.selectedQuestionIds = new Set(rawState.selectedQuestionIds);
    } else {
      migrated.selectedQuestionIds = defaults.selectedQuestionIds;
    }

    return migrated;
  }

  function safeParseState(serializedState) {
    if (!serializedState) {
      return { value: null, error: null };
    }
    try {
      return { value: JSON.parse(serializedState), error: null };
    } catch (error) {
      return { value: null, error };
    }
  }

  function loadState(storage, options = {}) {
    let serializedState = null;
    try {
      serializedState = storage && typeof storage.getItem === 'function'
        ? storage.getItem(DATA_STORAGE_KEY)
        : null;
    } catch (error) {
      return {
        state: createDefaultState(options),
        parsedState: null,
        error,
      };
    }

    const parsed = safeParseState(serializedState);
    return {
      state: parsed.error ? createDefaultState(options) : migrateState(parsed.value, options),
      parsedState: parsed.value,
      error: parsed.error,
    };
  }

  function createPersistableState(state, options = {}) {
    return {
      version: STATE_VERSION,
      questions: state.questions,
      sellingPoints: state.sellingPoints,
      articles: state.articles,
      nextQuestionId: state.nextQuestionId,
      nextSpId: state.nextSpId,
      nextArticleId: state.nextArticleId,
      testRecords: state.testRecords,
      nextRecordId: state.nextRecordId,
      selectedTitles: Array.isArray(options.selectedTitles) ? options.selectedTitles : [],
    };
  }

  function saveState(storage, state, options = {}) {
    if (!state) return null;
    state.version = STATE_VERSION;
    const data = createPersistableState(state, options);
    if (storage && typeof storage.setItem === 'function') {
      storage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
    }
    return data;
  }

  return {
    STATE_VERSION,
    DATA_STORAGE_KEY,
    createDefaultState,
    migrateState,
    safeParseState,
    loadState,
    saveState,
  };
});
