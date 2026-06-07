(function(root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.GeoArticlesRenderer = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(root) {
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

  function toTimestamp(value) {
    const time = new Date(value || 0).getTime();
    return Number.isFinite(time) ? time : 0;
  }

  function formatCount(value) {
    return toNumber(value).toLocaleString();
  }

  function formatUpdatedAt(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  function getPlatformLabel(platform) {
    return toText(platform && (platform.platform || platform.name || platform.key), '-');
  }

  function findQuestionText(questions, article) {
    const question = questions.find(item => item && item.id === article.questionId);
    if (question && question.question != null) return toText(question.question);
    if (article.questionId != null) return `#${article.questionId}`;
    if (article.id != null) return `文章 #${article.id}`;
    return '-';
  }

  function buildArticleRows(rawState = {}, options = {}) {
    const questions = toArray(rawState.questions);
    const platforms = toArray(options.platforms);
    const getArticlePlatformEntries = typeof options.getArticlePlatformEntries === 'function'
      ? options.getArticlePlatformEntries
      : getDefaultPlatformEntries;
    const hasPlatformContent = typeof options.hasPlatformContent === 'function'
      ? options.hasPlatformContent
      : getDefaultHasPlatformContent;
    const search = toText(options.search).trim().toLowerCase();
    const filterStatus = toText(options.filterStatus);
    const filterAngle = toText(options.filterAngle);

    let rows = toArray(rawState.articles).map((article, index) => {
      const source = article && typeof article === 'object' ? article : {};
      const questionText = findQuestionText(questions, source);
      const content = toText(source.content);
      const platformEntries = toArray(getArticlePlatformEntries(source));
      const mainCount = content.length;
      const platformContentLen = platformEntries.reduce((sum, entry) => {
        return sum + toText(entry && entry.content).length;
      }, 0);
      const platformCount = platformEntries.length;

      return {
        article: source,
        originalIndex: index,
        questionText,
        model: toText(source.model, '-').trim() || '-',
        angle: toText(source.angle),
        angleName: toText(source.angleName),
        mainCount,
        totalCount: mainCount + platformContentLen,
        platformCount,
        platforms: platforms.map(platform => ({
          label: getPlatformLabel(platform),
          hasContent: !!hasPlatformContent(source, platform),
        })),
        updatedAt: formatUpdatedAt(source.updatedAt),
        sortTime: toTimestamp(source.updatedAt || source.createdAt),
        searchText: `${questionText}\n${content}`.toLowerCase(),
      };
    });

    if (search) {
      rows = rows.filter(row => row.searchText.includes(search));
    }

    if (filterStatus === 'has-platforms') {
      rows = rows.filter(row => row.platformCount > 0);
    } else if (filterStatus === 'no-platforms') {
      rows = rows.filter(row => row.platformCount === 0);
    }

    if (filterAngle) {
      if (filterAngle === '_default') {
        rows = rows.filter(row => !row.angle);
      } else {
        rows = rows.filter(row => row.angle === filterAngle);
      }
    }

    rows.sort((a, b) => {
      const diff = b.sortTime - a.sortTime;
      return diff || a.originalIndex - b.originalIndex;
    });

    return rows;
  }

  function bindUi(ui, documentRef) {
    if (!ui) {
      throw new Error('GeoUIUtils is required by GeoArticlesRenderer');
    }
    return {
      clearElement: ui.clearElement,
      setText: ui.setText,
      appendChildren: ui.appendChildren,
      createElement(tagName, options = {}) {
        return ui.createElement(tagName, { documentRef, ...options });
      },
      createButton(label, options = {}) {
        return ui.createButton(label, { documentRef, ...options });
      },
      createOption(value, label, selected = false, options = {}) {
        return ui.createOption(value, label, selected, { documentRef, ...options });
      },
    };
  }

  function appendText(parent, ui, text) {
    parent.appendChild(ui.createElement('span', { text }));
  }

  function populateAngleFilter(select, angles, ui) {
    if (!select || !select.options || select.options.length > 1) return;
    const currentValue = select.value || '';
    toArray(angles).forEach(angle => {
      const label = `${toText(angle && angle.icon)} ${toText(angle && angle.name)}`.trim();
      select.appendChild(ui.createOption(toText(angle && angle.id), label));
    });
    select.appendChild(ui.createOption('_default', '📝 母稿'));
    select.value = currentValue;
  }

  function renderEmptyArticles(target, ui, actions = {}) {
    ui.clearElement(target);
    const card = ui.createElement('div', {
      className: 'card',
      styles: {
        padding: '48px',
        textAlign: 'center',
        color: 'var(--text-muted)',
      },
    });
    const icon = ui.createElement('p', {
      text: '📄',
      styles: {
        fontSize: '32px',
        marginBottom: '12px',
        opacity: '0.3',
      },
    });
    const message = ui.createElement('p');
    appendText(message, ui, '暂无文稿，去');
    const link = ui.createElement('a', {
      text: '内容工作台',
      attributes: { href: '#' },
      styles: { color: 'var(--blue)' },
      onClick: event => {
        if (event && typeof event.preventDefault === 'function') event.preventDefault();
        if (typeof actions.navigateToWorkspace === 'function') actions.navigateToWorkspace();
      },
    });
    message.appendChild(link);
    appendText(message, ui, '生成第一篇');
    card.appendChild(icon);
    card.appendChild(message);
    target.appendChild(card);
  }

  function createHeaderCheckbox(ui, actions) {
    const checkbox = ui.createElement('input', { attributes: { type: 'checkbox' } });
    checkbox.addEventListener('change', () => {
      if (typeof actions.toggleAllArticleCheckboxes === 'function') {
        actions.toggleAllArticleCheckboxes(!!checkbox.checked);
      }
    });
    return checkbox;
  }

  function appendHeaderCell(row, ui, text, child) {
    const th = ui.createElement('th');
    if (child) th.appendChild(child);
    else ui.setText(th, text);
    row.appendChild(th);
  }

  function appendCell(row, ui, text, options = {}) {
    const cell = ui.createElement('td', { text });
    if (options.className) cell.className = options.className;
    if (options.styles) Object.assign(cell.style, options.styles);
    if (options.title != null) cell.title = toText(options.title);
    row.appendChild(cell);
    return cell;
  }

  function createTag(ui, label, className, styles) {
    return ui.createElement('span', {
      className: `tag ${className}`,
      text: label,
      styles,
    });
  }

  function renderArticlesTable(target, rows, ui, actions = {}, platformCount = 0) {
    ui.clearElement(target);
    const table = ui.createElement('table', { className: 'table' });
    const thead = ui.createElement('thead');
    const headerRow = ui.createElement('tr');

    appendHeaderCell(headerRow, ui, '', createHeaderCheckbox(ui, actions));
    ['序号', '客户提问', '模型', '角度', '字数', '多平台状态', '更新时间', '操作'].forEach(text => {
      appendHeaderCell(headerRow, ui, text);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = ui.createElement('tbody');
    rows.forEach((row, index) => {
      const tr = ui.createElement('tr');
      const checkboxCell = appendCell(tr, ui, '');
      const checkbox = ui.createElement('input', {
        className: 'article-checkbox',
        attributes: { type: 'checkbox' },
        dataset: { id: row.article.id },
      });
      checkboxCell.appendChild(checkbox);

      appendCell(tr, ui, index + 1);
      appendCell(tr, ui, row.questionText, {
        title: row.questionText,
        styles: {
          maxWidth: '300px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      });

      const modelCell = appendCell(tr, ui, '');
      modelCell.appendChild(createTag(ui, row.model, 'tag-blue'));

      const angleCell = appendCell(tr, ui, '');
      if (row.angleName) {
        angleCell.appendChild(createTag(ui, row.angleName, 'tag-purple'));
      } else {
        angleCell.appendChild(createTag(ui, '母稿', 'tag-low'));
      }

      const countCell = appendCell(tr, ui, '');
      countCell.appendChild(ui.createElement('span', { text: formatCount(row.mainCount) }));
      countCell.appendChild(ui.createElement('br'));
      countCell.appendChild(ui.createElement('span', {
        className: 'text-sm text-muted',
        text: `总计 ${formatCount(row.totalCount)}`,
      }));

      const platformCell = appendCell(tr, ui, '');
      row.platforms.forEach(platform => {
        platformCell.appendChild(createTag(ui, platform.label, platform.hasContent ? 'tag-complete' : 'tag-low', {
          fontSize: '11px',
          padding: '1px 5px',
        }));
        platformCell.appendChild(ui.createElement('span', { text: ' ' }));
      });
      platformCell.appendChild(ui.createElement('span', {
        className: 'text-sm text-muted',
        text: `${row.platformCount}/${platformCount}`,
      }));

      appendCell(tr, ui, row.updatedAt, { className: 'text-sm text-muted' });

      const actionCell = appendCell(tr, ui, '');
      const viewButton = ui.createButton('👁️', {
        className: 'btn btn-ghost btn-sm',
        title: '查看/编辑',
        onClick: () => {
          if (typeof actions.viewArticle === 'function') actions.viewArticle(row.article.id);
        },
      });
      const exportButton = ui.createButton('📥', {
        className: 'btn btn-ghost btn-sm',
        title: '导出Word',
        onClick: () => {
          if (typeof actions.exportArticleWord === 'function') actions.exportArticleWord(row.article.id);
        },
      });
      const deleteButton = ui.createButton('🗑️', {
        className: 'btn btn-ghost btn-sm',
        title: '删除',
        onClick: () => {
          if (typeof actions.deleteArticle === 'function') actions.deleteArticle(row.article.id);
        },
      });
      actionCell.appendChild(viewButton);
      actionCell.appendChild(exportButton);
      actionCell.appendChild(deleteButton);

      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    target.appendChild(table);
  }

  function renderArticles(options = {}) {
    const documentRef = options.documentRef || root.document;
    if (!documentRef || typeof documentRef.getElementById !== 'function') {
      throw new Error('document.getElementById is unavailable');
    }

    const ui = bindUi(options.ui, documentRef);
    const searchEl = documentRef.getElementById('articleSearch');
    const statusEl = documentRef.getElementById('articleFilterStatus');
    const angleEl = documentRef.getElementById('articleFilterAngle');
    const countEl = documentRef.getElementById('articleCount');
    const tableEl = documentRef.getElementById('articlesTable');
    if (!tableEl) return [];

    populateAngleFilter(angleEl, options.angles, ui);

    const rows = buildArticleRows(options.state || {}, {
      platforms: options.platforms,
      getArticlePlatformEntries: options.getArticlePlatformEntries,
      hasPlatformContent: options.hasPlatformContent,
      search: searchEl ? searchEl.value : '',
      filterStatus: statusEl ? statusEl.value : '',
      filterAngle: angleEl ? angleEl.value : '',
    });

    if (countEl) ui.setText(countEl, `共 ${rows.length} 篇`);

    if (rows.length === 0) {
      renderEmptyArticles(tableEl, ui, options.actions);
    } else {
      renderArticlesTable(tableEl, rows, ui, options.actions, toArray(options.platforms).length);
    }

    return rows;
  }

  return {
    buildArticleRows,
    renderArticles,
  };
});
