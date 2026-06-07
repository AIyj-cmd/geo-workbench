(function(root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.GeoDashboardRenderer = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(root) {
  const DASHBOARD_CARD_IDS = [
    'trend', 'competitors', 'retest',
    'priorities', 'intents', 'statuses',
    'industries', 'clusters', 'progress',
    'testSummary', 'angles', 'platforms',
    'topSP', 'matrix',
  ];

  function toArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function toText(value, fallback = '') {
    if (value == null) return fallback;
    return String(value);
  }

  function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function truncate(value, length) {
    const text = toText(value);
    if (text.length <= length) return text;
    return `${text.slice(0, length)}...`;
  }

  function maxValue(values) {
    return Math.max(...values.map(value => toNumber(value)).filter(value => Number.isFinite(value)), 1);
  }

  function isMentioned(value) {
    return value === true || value === '是' || value === 'yes' || value === 'true';
  }

  function isValidDate(date) {
    return date instanceof Date && !Number.isNaN(date.getTime());
  }

  function increment(map, key, amount = 1) {
    const safeKey = toText(key).trim();
    if (!safeKey) return;
    map[safeKey] = (map[safeKey] || 0) + amount;
  }

  function getDefaultPlatformEntries(article) {
    const platforms = article && article.platforms && typeof article.platforms === 'object'
      ? article.platforms
      : {};
    return Object.entries(platforms)
      .filter(([, content]) => content && String(content).trim())
      .map(([key, content]) => ({ key, platform: key, content }));
  }

  function getDefaultHasPlatformContent(article, platform) {
    const platforms = article && article.platforms && typeof article.platforms === 'object'
      ? article.platforms
      : {};
    const keys = [
      platform && platform.key,
      platform && platform.platform,
      platform && platform.name,
      toText(platform),
    ].filter(Boolean);
    return keys.some(key => platforms[key] && String(platforms[key]).trim());
  }

  function buildDashboardStats(rawState = {}, options = {}) {
    const questions = toArray(rawState.questions);
    const articles = toArray(rawState.articles);
    const testRecords = toArray(rawState.testRecords);
    const platforms = toArray(options.platforms);
    const angles = toArray(options.angles);
    const titleTabState = options.titleTabState || {};
    const getArticlePlatformEntries = typeof options.getArticlePlatformEntries === 'function'
      ? options.getArticlePlatformEntries
      : getDefaultPlatformEntries;
    const hasPlatformContent = typeof options.hasPlatformContent === 'function'
      ? options.hasPlatformContent
      : getDefaultHasPlatformContent;

    const questionsWithArticles = new Set(articles.map(article => article && article.questionId).filter(id => id != null));
    const generatedCount = questionsWithArticles.size;
    const usedAngles = new Set(articles.map(article => article && article.angle).filter(Boolean));
    const testedQuestionIds = new Set(testRecords.map(record => record && record.questionId).filter(id => id != null));
    const mentionedQuestionIds = new Set(
      testRecords
        .filter(record => record && isMentioned(record.mentioned))
        .map(record => record.questionId)
        .filter(id => id != null)
    );

    let platformVersions = 0;
    articles.forEach(article => {
      platformVersions += toArray(getArticlePlatformEntries(article)).length;
    });

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const recentArticles = articles.filter(article => {
      if (!article || !article.createdAt) return false;
      const createdAt = new Date(article.createdAt);
      return isValidDate(createdAt) && createdAt >= weekAgo;
    }).length;

    const priorities = { '高': 0, '中': 0, '低': 0 };
    questions.forEach(question => increment(priorities, question && question.priority));

    const intents = {};
    questions.forEach(question => increment(intents, question && question.intent));

    const statuses = { '未开始': 0, '进行中': 0, '已发布': 0 };
    questions.forEach(question => increment(statuses, (question && question.status) || '未开始'));

    const industries = {};
    questions.forEach(question => increment(industries, question && question.industry));

    const clusterMap = {};
    questions.forEach(question => increment(clusterMap, question && question.cluster));
    const sortedClusters = Object.entries(clusterMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

    const angleMap = {};
    articles.forEach(article => increment(angleMap, article && article.angleName));
    const sortedAngles = Object.entries(angleMap).sort((a, b) => b[1] - a[1]);

    const platformMap = {};
    articles.forEach(article => {
      platforms.forEach(platform => {
        if (hasPlatformContent(article, platform)) {
          increment(platformMap, platform.platform || platform.name || platform.key);
        }
      });
    });

    const spUsage = {};
    questions.forEach(question => increment(spUsage, question && question.sellingPoint));
    const topSP = Object.entries(spUsage).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const angleNames = Array.from(usedAngles).map(id => {
      const angle = angles.find(item => item && item.id === id);
      return angle ? angle.name : id;
    }).filter(Boolean);

    const matrixData = {};
    articles.forEach(article => {
      if (!article || article.questionId == null) return;
      if (!matrixData[article.questionId]) matrixData[article.questionId] = new Set();
      if (article.angleName) matrixData[article.questionId].add(article.angleName);
    });

    const mentionTrend = {};
    testRecords.forEach(record => {
      if (!record || !record.testDate) return;
      const date = new Date(record.testDate);
      if (!isValidDate(date)) return;
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const key = weekStart.toISOString().slice(0, 10);
      if (!mentionTrend[key]) mentionTrend[key] = { total: 0, mentioned: 0 };
      mentionTrend[key].total++;
      if (isMentioned(record.mentioned)) mentionTrend[key].mentioned++;
    });
    const trendData = Object.entries(mentionTrend)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([week, data]) => ({
        week,
        label: week.slice(5),
        rate: data.total > 0 ? Math.round((data.mentioned / data.total) * 100) : 0,
        total: data.total,
        mentioned: data.mentioned,
      }));

    const competitorMap = {};
    testRecords.forEach(record => {
      const competitors = record && record.competitors;
      if (!competitors) return;
      String(competitors).split(/[,;，；\n]+/)
        .map(name => name.trim())
        .filter(Boolean)
        .forEach(name => increment(competitorMap, name));
    });
    const topCompetitors = Object.entries(competitorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    const pendingRetest = questions.filter(question => {
      if (!question || !question.retestDate) return false;
      const retestDate = new Date(question.retestDate);
      return isValidDate(retestDate) && retestDate >= today && retestDate <= endOfWeek;
    }).sort((a, b) => toText(a.retestDate).localeCompare(toText(b.retestDate)));

    const selectedTitles = toArray(titleTabState.selectedTitles);
    const mentionRate = testedQuestionIds.size > 0
      ? Math.round((mentionedQuestionIds.size / testedQuestionIds.size) * 100)
      : 0;

    return {
      questions,
      articles,
      testRecords,
      questionCount: questions.length,
      selectedCount: selectedTitles.length,
      poolTotal: toNumber(titleTabState.poolTotal),
      generatedCount,
      notGenerated: Math.max(questions.length - generatedCount, 0),
      platformVersions,
      testedCount: testedQuestionIds.size,
      mentionedCount: mentionedQuestionIds.size,
      mentionRate,
      recentArticles,
      priorities,
      intents,
      statuses,
      industries,
      sortedClusters,
      sortedAngles,
      platformMap,
      topSP,
      topQuestions: questions.slice(0, 5),
      angleNames,
      matrixData,
      trendData,
      topCompetitors,
      pendingRetest,
      maxPriority: maxValue(Object.values(priorities)),
      maxIntent: maxValue(Object.values(intents)),
      maxStatus: maxValue(Object.values(statuses)),
      maxIndustry: maxValue(Object.values(industries)),
      maxCluster: sortedClusters.length > 0 ? sortedClusters[0][1] : 1,
      maxAngle: sortedAngles.length > 0 ? sortedAngles[0][1] : 1,
      maxPlatform: maxValue(Object.values(platformMap)),
      maxSellingPoint: topSP.length > 0 ? topSP[0][1] : 1,
      maxCompetitor: topCompetitors.length > 0 ? topCompetitors[0][1] : 1,
      maxTrendRate: 100,
    };
  }

  function getCardOrder(storage) {
    if (!storage || typeof storage.getItem !== 'function') return [...DASHBOARD_CARD_IDS];
    try {
      const saved = storage.getItem('dashboardCardOrder');
      if (!saved) return [...DASHBOARD_CARD_IDS];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [...DASHBOARD_CARD_IDS];
      const validIds = parsed.filter(id => DASHBOARD_CARD_IDS.includes(id));
      const newIds = DASHBOARD_CARD_IDS.filter(id => !validIds.includes(id));
      return [...validIds, ...newIds];
    } catch {
      return [...DASHBOARD_CARD_IDS];
    }
  }

  function saveCardOrder(storage, cardOrder) {
    if (!storage || typeof storage.setItem !== 'function') return;
    try {
      storage.setItem('dashboardCardOrder', JSON.stringify(cardOrder));
    } catch {
      // Non-critical preference persistence; rendering must continue.
    }
  }

  function renderDashboard(options = {}) {
    const documentRef = options.documentRef || root.document;
    const ui = options.ui || root.GeoUIUtils;
    if (!documentRef || !ui) {
      throw new Error('GeoDashboardRenderer requires document and GeoUIUtils');
    }

    const boundUi = bindUiToDocument(ui, documentRef);
    const storage = options.storage || root.localStorage;
    const stats = buildDashboardStats(options.state || {}, options);
    const statsEl = options.statsEl || documentRef.getElementById('dashboardStats');
    const chartsEl = options.chartsEl || documentRef.getElementById('dashboardCharts');
    const cardOrder = getCardOrder(storage);

    if (statsEl) renderStats(statsEl, stats, boundUi);
    if (chartsEl) {
      bindDragHandlers(chartsEl, cardOrder, storage, options);
      renderCards(chartsEl, cardOrder, stats, boundUi, documentRef);
    }

    return stats;
  }

  function bindUiToDocument(ui, documentRef) {
    return {
      ...ui,
      createElement(tagName, options = {}) {
        return ui.createElement(tagName, {
          documentRef,
          ...options,
        });
      },
      renderEmptyState(message, options = {}) {
        return ui.renderEmptyState(message, {
          documentRef,
          ...options,
        });
      },
    };
  }

  function renderStats(statsEl, stats, ui) {
    ui.clearElement(statsEl);
    [
      ['blue', stats.selectedCount, '精选题库'],
      ['purple', stats.poolTotal, '总题库'],
      ['green', stats.generatedCount, '已生成母稿'],
      ['orange', stats.platformVersions, '平台版本'],
      ['cyan', stats.testedCount, '已测试'],
      ['red', `${stats.mentionRate}%`, 'AI提及率'],
    ].forEach(([color, value, label]) => {
      const card = ui.createElement('div', { className: 'dash-stat' });
      card.appendChild(ui.createElement('div', {
        className: `dash-stat-value ${color}`,
        text: value,
      }));
      card.appendChild(ui.createElement('div', {
        className: 'dash-stat-label',
        text: label,
      }));
      statsEl.appendChild(card);
    });
  }

  function bindDragHandlers(chartsEl, cardOrder, storage, options) {
    let draggedCardId = null;

    chartsEl.ondragstart = event => {
      draggedCardId = event.target && event.target.dataset ? event.target.dataset.cardId : null;
      if (event.target && event.target.classList) event.target.classList.add('dash-card-dragging');
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', draggedCardId || '');
      }
    };
    chartsEl.ondragover = event => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
      const target = event.target && event.target.closest ? event.target.closest('.dash-chart-card') : null;
      if (target && target.dataset.cardId !== draggedCardId && target.classList) {
        target.classList.add('dash-card-dragover');
      }
    };
    chartsEl.ondragleave = event => {
      const target = event.target && event.target.closest ? event.target.closest('.dash-chart-card') : null;
      if (target && target.classList) target.classList.remove('dash-card-dragover');
    };
    chartsEl.ondrop = event => {
      event.preventDefault();
      const target = event.target && event.target.closest ? event.target.closest('.dash-chart-card') : null;
      if (!target || !draggedCardId) return;
      const targetId = target.dataset.cardId;
      if (targetId === draggedCardId) return;

      const fromIndex = cardOrder.indexOf(draggedCardId);
      const toIndex = cardOrder.indexOf(targetId);
      if (fromIndex < 0 || toIndex < 0) return;
      cardOrder.splice(fromIndex, 1);
      cardOrder.splice(toIndex, 0, draggedCardId);
      saveCardOrder(storage, cardOrder);
      renderDashboard(options);
    };
    chartsEl.ondragend = () => {
      if (typeof chartsEl.querySelectorAll === 'function') {
        chartsEl.querySelectorAll('.dash-card-dragging, .dash-card-dragover').forEach(element => {
          element.classList.remove('dash-card-dragging', 'dash-card-dragover');
        });
      }
      draggedCardId = null;
    };
  }

  function renderCards(chartsEl, cardOrder, stats, ui, documentRef) {
    ui.clearElement(chartsEl);
    const cards = buildCards(stats);
    cardOrder.forEach(cardId => {
      const definition = cards[cardId];
      if (!definition) return;
      const card = ui.createElement('div', {
        className: 'dash-chart-card',
        dataset: { cardId },
      });
      card.draggable = true;
      if (definition.span > 1) card.style.gridColumn = `span ${definition.span}`;
      card.appendChild(ui.createElement('h4', { text: definition.title }));
      definition.render(card, { stats, ui, documentRef });
      chartsEl.appendChild(card);
    });
  }

  function buildCards(stats) {
    return {
      trend: {
        title: '📈 AI提及率趋势线',
        span: 2,
        render: renderTrendCard,
      },
      competitors: {
        title: '🏆 竞品出现频次榜',
        span: 1,
        render: renderCompetitorsCard,
      },
      retest: {
        title: '🔁 本周待复测',
        span: 1,
        render: renderRetestCard,
      },
      priorities: {
        title: '📊 优先级分布',
        span: 1,
        render: (card, ctx) => renderBars(card, Object.entries(stats.priorities), stats.maxPriority, row => {
          if (row[0] === '高') return 'red';
          if (row[0] === '中') return 'orange';
          return 'gray';
        }, ctx),
      },
      intents: {
        title: '🔍 搜索意图分布',
        span: 1,
        render: (card, ctx) => renderBars(card, Object.entries(stats.intents).sort((a, b) => b[1] - a[1]), stats.maxIntent, 'purple', ctx),
      },
      statuses: {
        title: '📋 内容状态分布',
        span: 1,
        render: (card, ctx) => renderBars(card, Object.entries(stats.statuses), stats.maxStatus, row => {
          if (row[0] === '已发布') return 'green';
          if (row[0] === '进行中') return 'blue';
          return 'gray';
        }, ctx),
      },
      industries: {
        title: '🏢 行业分布',
        span: 1,
        render: (card, ctx) => renderBars(card, Object.entries(stats.industries).sort((a, b) => b[1] - a[1]), stats.maxIndustry, 'blue', ctx),
      },
      clusters: {
        title: '🎯 选题簇分布 Top 6',
        span: 1,
        render: (card, ctx) => renderBars(card, stats.sortedClusters, stats.maxCluster, 'cyan', ctx, { maxWidth: '160px' }),
      },
      progress: {
        title: '📝 内容生产进度',
        span: 1,
        render: renderProgressCard,
      },
      testSummary: {
        title: '🧪 测试记录摘要',
        span: 1,
        render: renderTestSummaryCard,
      },
      angles: stats.sortedAngles.length > 0 ? {
        title: '📌 角度使用分布',
        span: 1,
        render: (card, ctx) => renderBars(card, stats.sortedAngles, stats.maxAngle, 'orange', ctx),
      } : null,
      platforms: Object.keys(stats.platformMap).length > 0 ? {
        title: '📣 平台覆盖',
        span: 1,
        render: (card, ctx) => renderBars(card, Object.entries(stats.platformMap).sort((a, b) => b[1] - a[1]), stats.maxPlatform, 'green', ctx),
      } : null,
      topSP: stats.topSP.length > 0 ? {
        title: '🔥 热门卖点 Top 5',
        span: 1,
        render: (card, ctx) => renderBars(card, stats.topSP, stats.maxSellingPoint, 'red', ctx, { maxWidth: '180px' }),
      } : null,
      matrix: stats.angleNames.length > 0 ? {
        title: '🧩 问题×角度覆盖矩阵',
        span: 2,
        render: renderMatrixCard,
      } : null,
    };
  }

  function renderEmpty(card, text, ui) {
    card.appendChild(ui.createElement('div', {
      className: 'dash-empty-hint',
      text,
    }));
  }

  function renderBars(card, rows, max, colorOrResolver, ctx, options = {}) {
    const { ui } = ctx;
    if (!rows.length) {
      renderEmpty(card, '暂无数据', ui);
      return;
    }

    rows.forEach((row, index) => {
      const [label, value] = row;
      const color = typeof colorOrResolver === 'function' ? colorOrResolver(row, index) : colorOrResolver;
      const rowEl = ui.createElement('div', { className: 'bar-chart-row' });
      const labelEl = ui.createElement('div', {
        className: 'bar-label',
        text: options.rank ? `${getRankPrefix(index)} ${label}` : label,
        title: label,
      });
      if (options.maxWidth) {
        labelEl.style.maxWidth = options.maxWidth;
        labelEl.style.overflow = 'hidden';
        labelEl.style.textOverflow = 'ellipsis';
        labelEl.style.whiteSpace = 'nowrap';
      }
      const track = ui.createElement('div', { className: 'bar-track' });
      track.appendChild(ui.createElement('div', {
        className: `bar-fill bar-${color}`,
        styles: { width: `${Math.round((toNumber(value) / max) * 100)}%` },
      }));
      rowEl.appendChild(labelEl);
      rowEl.appendChild(track);
      rowEl.appendChild(ui.createElement('div', { className: 'bar-value', text: value }));
      card.appendChild(rowEl);
    });
  }

  function getRankPrefix(index) {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  }

  function renderTrendCard(card, { stats, ui }) {
    if (!stats.trendData.length) {
      renderEmpty(card, '暂无测试数据，添加测试记录后自动生成趋势线', ui);
      return;
    }

    const chart = ui.createElement('div', { className: 'dash-trend-chart' });
    const axis = ui.createElement('div', { className: 'dash-trend-y' });
    ['100%', '75%', '50%', '25%', '0%'].forEach(label => {
      axis.appendChild(ui.createElement('span', { text: label }));
    });
    const bars = ui.createElement('div', { className: 'dash-trend-bars' });
    stats.trendData.forEach(item => {
      const col = ui.createElement('div', { className: 'dash-trend-col' });
      const track = ui.createElement('div', { className: 'dash-trend-bar-track' });
      const bar = ui.createElement('div', {
        className: 'dash-trend-bar',
        title: `${item.rate}% (${item.mentioned}/${item.total})`,
        styles: { height: `${Math.round((item.rate / stats.maxTrendRate) * 100)}%` },
      });
      bar.appendChild(ui.createElement('span', { className: 'dash-trend-value', text: `${item.rate}%` }));
      track.appendChild(bar);
      col.appendChild(track);
      col.appendChild(ui.createElement('div', { className: 'dash-trend-label', text: item.label }));
      bars.appendChild(col);
    });
    chart.appendChild(axis);
    chart.appendChild(bars);
    card.appendChild(chart);
    card.appendChild(ui.createElement('div', {
      className: 'dash-trend-footer',
      text: '每周AI提及率 = 该周被提及问题数 / 该周已测试问题数',
    }));
  }

  function renderCompetitorsCard(card, ctx) {
    if (!ctx.stats.topCompetitors.length) {
      renderEmpty(card, '暂无竞品数据，测试记录中填写「AI引用了谁」后自动统计', ctx.ui);
      return;
    }
    renderBars(card, ctx.stats.topCompetitors, ctx.stats.maxCompetitor, 'red', ctx, { rank: true });
  }

  function renderRetestCard(card, { stats, ui }) {
    if (!stats.pendingRetest.length) {
      renderEmpty(card, '本周无需复测的记录', ui);
      return;
    }

    const list = ui.createElement('div', { className: 'dash-retest-list' });
    stats.pendingRetest.slice(0, 8).forEach(question => {
      const item = ui.createElement('div', { className: 'dash-retest-item' });
      item.appendChild(ui.createElement('span', {
        className: 'dash-retest-date',
        text: toText(question.retestDate).slice(5),
      }));
      item.appendChild(ui.createElement('span', {
        className: 'dash-retest-q',
        text: truncate(question.question, 25),
        title: question.question,
      }));
      item.appendChild(ui.createElement('span', {
        className: `dash-retest-status tag ${isMentioned(question.mentioned) ? 'tag-green' : 'tag-pending'}`,
        text: isMentioned(question.mentioned) ? '已提及' : '未提及',
      }));
      list.appendChild(item);
    });
    if (stats.pendingRetest.length > 8) {
      list.appendChild(ui.createElement('div', {
        className: 'dash-retest-more',
        text: `还有 ${stats.pendingRetest.length - 8} 条...`,
      }));
    }
    card.appendChild(list);
  }

  function renderProgressCard(card, { stats, ui }) {
    const progressPercent = stats.questionCount > 0
      ? Math.round((stats.generatedCount / stats.questionCount) * 100)
      : 0;
    const dashValue = stats.questionCount > 0
      ? (stats.generatedCount / stats.questionCount) * 251
      : 0;

    const ring = ui.createElement('div', { className: 'dash-progress-ring' });
    // Static SVG skeleton only; dynamic values are numeric counts computed above.
    ring.innerHTML = `
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" stroke-width="8"></circle>
        <circle cx="50" cy="50" r="40" fill="none" stroke="${stats.generatedCount > 0 ? '#10b981' : '#d1d5db'}" stroke-width="8"
          stroke-dasharray="${dashValue} 251" stroke-linecap="round" transform="rotate(-90 50 50)"></circle>
      </svg>
    `;
    ring.appendChild(ui.createElement('div', {
      className: 'dash-progress-text',
      text: `${progressPercent}%`,
    }));
    card.appendChild(ring);

    const labels = ui.createElement('div', { className: 'dash-progress-labels' });
    labels.appendChild(createDotLabel(ui, 'green', `已生成 ${stats.generatedCount}`));
    labels.appendChild(createDotLabel(ui, 'gray', `未生成 ${stats.notGenerated}`));
    card.appendChild(labels);
  }

  function createDotLabel(ui, color, text) {
    const label = ui.createElement('span');
    label.appendChild(ui.createElement('i', { className: `dot ${color}` }));
    label.appendChild(ui.createElement('span', { text }));
    return label;
  }

  function renderTestSummaryCard(card, { stats, ui }) {
    const grid = ui.createElement('div', { className: 'dash-metrics-grid' });
    [
      ['blue', stats.testedCount, '已测试问题'],
      ['green', stats.mentionedCount, 'AI已提及'],
      ['purple', `${stats.mentionRate}%`, '提及率'],
      ['orange', stats.recentArticles, '近7天新增'],
    ].forEach(([color, value, label]) => {
      const item = ui.createElement('div', { className: 'dash-metric-item' });
      item.appendChild(ui.createElement('div', { className: `dash-metric-num ${color}`, text: value }));
      item.appendChild(ui.createElement('div', { className: 'dash-metric-desc', text: label }));
      grid.appendChild(item);
    });
    card.appendChild(grid);
  }

  function renderMatrixCard(card, { stats, ui }) {
    const wrapper = ui.createElement('div', { className: 'dash-matrix-wrapper' });
    const table = ui.createElement('table', { className: 'dash-matrix' });
    const thead = ui.createElement('thead');
    const headRow = ui.createElement('tr');
    headRow.appendChild(ui.createElement('th', { text: '问题' }));
    stats.angleNames.forEach(angleName => {
      headRow.appendChild(ui.createElement('th', {
        text: toText(angleName).slice(0, 4),
        title: angleName,
      }));
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = ui.createElement('tbody');
    stats.topQuestions.forEach(question => {
      const row = ui.createElement('tr');
      row.appendChild(ui.createElement('td', {
        text: truncate(question.question, 20),
        title: question.question,
        styles: {
          maxWidth: '160px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      }));
      const covered = stats.matrixData[question.id] || new Set();
      stats.angleNames.forEach(angleName => {
        row.appendChild(ui.createElement('td', { text: covered.has(angleName) ? '✓' : '—' }));
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    wrapper.appendChild(table);
    card.appendChild(wrapper);
  }

  return {
    DASHBOARD_CARD_IDS,
    buildDashboardStats,
    renderDashboard,
  };
});
