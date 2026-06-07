(function(root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.GeoExportClient = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(root) {
  function stringValue(value) {
    return value == null ? '' : String(value);
  }

  function escapeHtml(text) {
    const value = stringValue(text);
    if (!value) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;', '`': '&#96;' };
    return value.replace(/[&<>"'`]/g, m => map[m]);
  }

  function sanitizeFilename(name) {
    return stringValue(name).replace(/[\/\\:*?"<>|]/g, '_');
  }

  function getDate(now) {
    return now instanceof Date ? now : (now ? new Date(now) : new Date());
  }

  function mdToWordHtml(md) {
    const markdown = stringValue(md);
    if (!markdown) return '';

    let html = '';
    let inUl = false;
    let inOl = false;
    let inTable = false;
    let inBlockquote = false;
    let inThead = false;
    const lines = markdown.split('\n');

    const emojiDigits = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

    function escapeHtmlInline(text) {
      return stringValue(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function processInline(text) {
      text = stringValue(text).replace(/〔①[^〕]*〕/g, '');
      text = text.replace(/〔[^〕]*〕/g, '');
      text = text.replace(/【[^】]*】/g, '');
      text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
      text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      return text;
    }

    function closeList() {
      if (inUl) { html += '</ul>\n'; inUl = false; }
      if (inOl) { html += '</ol>\n'; inOl = false; }
    }

    function closeBlockquote() {
      if (inBlockquote) { html += '</blockquote>\n'; inBlockquote = false; }
    }

    function closeTable() {
      if (inTable) {
        if (inThead) { html += '</thead>\n'; inThead = false; }
        html += '</tbody></table>\n';
        inTable = false;
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (/^\|[\s\-:]+\|/.test(trimmed) && /^[\|\s\-:]+$/.test(trimmed)) {
        continue;
      }

      if (trimmed === '') {
        closeBlockquote();
        closeTable();
        continue;
      }

      if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
        closeList();
        closeBlockquote();
        closeTable();
        html += '<hr>\n';
        continue;
      }

      if (trimmed.startsWith('#')) {
        closeList();
        closeBlockquote();
        closeTable();
        const match = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          html += `<h${level}>${processInline(escapeHtmlInline(match[2]))}</h${level}>\n`;
          continue;
        }
      }

      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        closeList();
        closeBlockquote();
        const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());

        if (!inTable) {
          html += '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;margin:12px 0;">\n';
          inTable = true;
          html += '<thead>\n';
          inThead = true;
          html += '<tr>' + cells.map(c => `<th style="background:#f3f4f6;font-weight:600;">${processInline(escapeHtmlInline(c))}</th>`).join('') + '</tr>\n';
        } else {
          if (inThead) {
            html += '</thead>\n<tbody>\n';
            inThead = false;
          }
          html += '<tr>' + cells.map(c => `<td>${processInline(escapeHtmlInline(c))}</td>`).join('') + '</tr>\n';
        }
        continue;
      }

      if (inTable && !trimmed.startsWith('|')) {
        closeTable();
      }

      if (trimmed.startsWith('> ')) {
        closeList();
        if (!inBlockquote) {
          html += '<blockquote style="border-left:3px solid #d1d5db;padding:8px 16px;margin:12px 0;color:#6b7280;">\n';
          inBlockquote = true;
        }
        html += `<p>${processInline(escapeHtmlInline(trimmed.slice(2)))}</p>\n`;
        continue;
      } else {
        closeBlockquote();
      }

      let isEmojiListItem = false;
      for (let di = 0; di < emojiDigits.length; di++) {
        if (trimmed.startsWith(emojiDigits[di])) {
          isEmojiListItem = true;
          if (!inOl) {
            closeList();
            html += '<ol>\n';
            inOl = true;
          }
          const content = trimmed.slice(emojiDigits[di].length).trim();
          html += `<li>${processInline(escapeHtmlInline(content))}</li>\n`;
          break;
        }
      }
      if (isEmojiListItem) continue;

      if (/^[-\*•]\s+/.test(trimmed)) {
        closeBlockquote();
        closeTable();
        if (!inUl) {
          closeList();
          html += '<ul>\n';
          inUl = true;
        }
        const content = trimmed.replace(/^[-\*•]\s+/, '');
        html += `<li>${processInline(escapeHtmlInline(content))}</li>\n`;
        continue;
      }

      const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
      if (olMatch) {
        closeBlockquote();
        closeTable();
        if (!inOl) {
          closeList();
          html += '<ol>\n';
          inOl = true;
        }
        html += `<li>${processInline(escapeHtmlInline(olMatch[2]))}</li>\n`;
        continue;
      }

      if (inOl && html.endsWith('</li>\n')) {
        html = html.replace(/<\/li>\n$/, `<br>${processInline(escapeHtmlInline(trimmed))}</li>\n`);
      } else {
        closeList();
        closeBlockquote();
        closeTable();
        html += `<p>${processInline(escapeHtmlInline(trimmed))}</p>\n`;
      }
    }

    closeList();
    closeBlockquote();
    closeTable();

    return html;
  }

  function wordStyles() {
    return `    body { font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif; font-size: 14px; line-height: 1.8; color: #1a1a2e; max-width: 800px; margin: 0 auto; padding: 24px; }
    h1 { font-size: 22px; font-weight: 700; margin: 20px 0 12px; }
    h2 { font-size: 18px; font-weight: 700; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin: 28px 0 12px; }
    h3 { font-size: 16px; font-weight: 600; margin: 20px 0 8px; }
    p { margin: 8px 0; }
    ul, ol { padding-left: 24px; margin: 8px 0; }
    li { margin: 4px 0; }
    table { border-collapse: collapse; width: 100%; margin: 12px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
    th { background: #f3f4f6; font-weight: 600; }
    blockquote { border-left: 3px solid #d1d5db; padding: 8px 16px; margin: 12px 0; color: #6b7280; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
    strong { font-weight: 700; }
    .platform-section { page-break-before: always; margin-top: 40px; }
    .platform-header { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px; }
    .platform-header h2 { border: none; margin: 0; padding: 0; font-size: 20px; }
    .platform-meta { font-size: 12px; color: #6b7280; margin-top: 4px; }`;
  }

  function buildMasterDraftWordHtml(options = {}) {
    const title = stringValue(options.title);
    const html = mdToWordHtml(options.content);
    const date = getDate(options.now).toLocaleDateString('zh-CN');
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
${wordStyles()}
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${html}
  <hr>
  <p style="font-size:11px;color:#9ca3af;text-align:center;">由 GEO 内容工作台生成 · ${date}</p>
</body>
</html>`;
  }

  function normalizePlatformVersions(platforms) {
    return Array.isArray(platforms) ? platforms : [];
  }

  function buildDistributionWordHtml(options = {}) {
    const title = stringValue(options.title);
    const article = options.article || {};
    const platforms = normalizePlatformVersions(options.platforms);
    let sectionsHtml = '';

    if (article.content) {
      sectionsHtml += `
    <div class="platform-section">
      <div class="platform-header">
        <h2>📝 母稿（原始版本）</h2>
        <div class="platform-meta">信息最全、最长、最权威的超集版本</div>
      </div>
      ${mdToWordHtml(article.content)}
    </div>`;
    }

    for (const platform of platforms) {
      const content = stringValue(platform.content);
      if (content && content.trim()) {
        sectionsHtml += `
    <div class="platform-section">
      <div class="platform-header">
        <h2>${stringValue(platform.icon)} ${stringValue(platform.platform)}（${stringValue(platform.form)}）</h2>
        <div class="platform-meta">建议篇幅：${stringValue(platform.length)} · ${stringValue(platform.geoValue)}</div>
      </div>
      ${mdToWordHtml(content)}
    </div>`;
      }
    }

    const versionCount = options.versionCount != null ? options.versionCount : platforms.filter(platform => stringValue(platform.content).trim()).length + 1;
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
${wordStyles()}
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p style="font-size:12px;color:#6b7280;">生成时间：${getDate(options.now).toLocaleString('zh-CN')} · 共 ${versionCount} 个版本</p>
  ${sectionsHtml}
  <hr>
  <p style="font-size:11px;color:#9ca3af;text-align:center;">由 GEO 内容工作台生成</p>
</body>
</html>`;
  }

  function buildArticleWordHtml(options = {}) {
    const title = stringValue(options.title);
    const article = options.article || {};
    const platformEntries = Array.isArray(options.platformEntries) ? options.platformEntries : [];
    let sectionsHtml = '';

    if (article.content) {
      sectionsHtml += `
    <div class="platform-section">
      <div class="platform-header">
        <h2>📝 母稿</h2>
        <div class="platform-meta">${article.model || '未知模型'} · ${stringValue(article.content).length.toLocaleString()} 字</div>
      </div>
      ${mdToWordHtml(article.content)}
    </div>`;
    }

    for (const entry of platformEntries) {
      const dm = entry.dm;
      sectionsHtml += `
    <div class="platform-section">
      <div class="platform-header">
        <h2>${dm ? dm.icon : '📄'} ${stringValue(entry.platform)}${dm ? `（${dm.form}）` : ''}</h2>
        ${dm ? `<div class="platform-meta">建议篇幅：${dm.length} · ${dm.geoValue}</div>` : ''}
      </div>
      ${mdToWordHtml(entry.content)}
    </div>`;
    }

    const platformCount = platformEntries.length;
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
${wordStyles()}
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p style="font-size:12px;color:#6b7280;">生成时间：${article.updatedAt ? new Date(article.updatedAt).toLocaleString('zh-CN') : '-'} · 共 ${platformCount + 1} 个版本</p>
  ${sectionsHtml}
  <hr>
  <p style="font-size:11px;color:#9ca3af;text-align:center;">由 GEO 内容工作台生成</p>
</body>
</html>`;
  }

  function buildAllArticlesWordHtml(options = {}) {
    const articles = Array.isArray(options.articles) ? options.articles : [];
    let sectionsHtml = '';

    articles.forEach((item, idx) => {
      const article = item.article || {};
      const title = stringValue(item.title || `文章 #${article.id}`);
      const platformEntries = Array.isArray(item.platformEntries) ? item.platformEntries : [];
      const platformCount = platformEntries.length;

      sectionsHtml += `
    <div class="platform-section">
      <div class="platform-header">
        <h2>${idx + 1}. ${escapeHtml(title)}</h2>
        <div class="platform-meta">${article.model || '未知模型'} · ${stringValue(article.content).length.toLocaleString()} 字 · ${platformCount} 个平台版本</div>
      </div>
      ${mdToWordHtml(article.content || '')}
    </div>`;

      if (platformEntries.length > 0) {
        for (const entry of platformEntries) {
          const dm = entry.dm;
          sectionsHtml += `
    <div class="platform-section" style="margin-left:24px;">
      <div class="platform-header">
        <h2>${dm ? dm.icon : '📄'} ${stringValue(entry.platform)}${dm ? `（${dm.form}）` : ''}</h2>
      </div>
      ${mdToWordHtml(entry.content)}
    </div>`;
        }
      }
    });

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>全部文章导出</title>
  <style>
${wordStyles()}
  </style>
</head>
<body>
  <h1>全部文章导出</h1>
  <p style="font-size:12px;color:#6b7280;">导出时间：${getDate(options.now).toLocaleString('zh-CN')} · 共 ${articles.length} 篇文章</p>
  ${sectionsHtml}
  <hr>
  <p style="font-size:11px;color:#9ca3af;text-align:center;">由 GEO 内容工作台生成</p>
</body>
</html>`;
  }

  function downloadWordHtml(fullHtml, filename, options = {}) {
    const documentRef = options.documentRef || root.document;
    const BlobCtor = options.BlobCtor || root.Blob;
    const URLRef = options.URLRef || root.URL;
    if (!documentRef || !BlobCtor || !URLRef) {
      throw new Error('Word download environment is unavailable');
    }

    const blob = new BlobCtor([fullHtml], { type: 'application/msword' });
    const url = URLRef.createObjectURL(blob);
    const a = documentRef.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URLRef.revokeObjectURL(url);
    return { blob, url, filename };
  }

  function exportToWord(title, content, options = {}) {
    const html = buildMasterDraftWordHtml({ title, content, now: options.now });
    const filename = `${sanitizeFilename(title).slice(0, 50)}.doc`;
    downloadWordHtml(html, filename, options);
    return { html, filename };
  }

  function exportDistributionArticles(options = {}) {
    const html = buildDistributionWordHtml(options);
    const filename = `一稿多发-${sanitizeFilename(options.title).slice(0, 40)}.doc`;
    downloadWordHtml(html, filename, options);
    return { html, filename };
  }

  function exportArticleWord(options = {}) {
    const html = buildArticleWordHtml(options);
    const filename = `${sanitizeFilename(options.title).slice(0, 50)}.doc`;
    downloadWordHtml(html, filename, options);
    return { html, filename };
  }

  function exportAllArticlesWord(options = {}) {
    const html = buildAllArticlesWordHtml(options);
    const filename = `全部文章-${getDate(options.now).toISOString().slice(0, 10)}.doc`;
    downloadWordHtml(html, filename, options);
    return { html, filename };
  }

  return {
    escapeHtml,
    sanitizeFilename,
    mdToWordHtml,
    buildMasterDraftWordHtml,
    buildDistributionWordHtml,
    buildArticleWordHtml,
    buildAllArticlesWordHtml,
    downloadWordHtml,
    exportToWord,
    exportDistributionArticles,
    exportArticleWord,
    exportAllArticlesWord,
  };
});
