const fs = require('fs');
const path = require('path');
const { ROOT_DIR } = require('../config');

const DATA_DIR = path.join(ROOT_DIR, 'data');
const DEFAULT_KEYWORD_DIR = path.join(ROOT_DIR, 'keyword_title_outputs');
const AGGREGATE_POOL_CATEGORY = {
  key: 'all_titles',
  label: '总题库',
  color: '#6b7280',
};
const FALLBACK_POOL_FILES = [
  path.join(DEFAULT_KEYWORD_DIR, 'all_titles.txt'),
  path.join(DATA_DIR, 'all_titles.txt'),
  path.join(DATA_DIR, 'selected_top_1000.txt'),
  path.join(DATA_DIR, 'selected_top_100.txt'),
];

const SELECTED_FILES = [
  { key: 'first_batch', file: 'selected_first_batch_15.txt', label: '第一批母稿', color: '#ef4444' },
  { key: 'commercial_geo', file: 'selected_commercial_geo_30.txt', label: '商业GEO', color: '#8b5cf6' },
  { key: 'cost_switch', file: 'selected_cost_switch_30.txt', label: '成本切换', color: '#f59e0b' },
  { key: 'region', file: 'selected_region_30.txt', label: '区域云仓', color: '#10b981' },
  { key: 'reverse_logistics', file: 'selected_reverse_logistics_30.txt', label: '退货逆向', color: '#3b82f6' },
  { key: 'sla_contract', file: 'selected_sla_contract_30.txt', label: 'SLA合同', color: '#ec4899' },
  { key: 'wms_inventory', file: 'selected_wms_inventory_30.txt', label: 'WMS库存', color: '#06b6d4' },
];

// 15 category files for the pool
const POOL_CATEGORIES = [
  { key: 'shoes_clothing', file: '01_鞋服云仓_服装电商仓配.txt', label: '鞋服云仓', color: '#ef4444' },
  { key: 'womens_returns', file: '02_女装品牌_高退货率场景.txt', label: '女装退货', color: '#f43f5e' },
  { key: 'xiaohongshu', file: '03_小红书电商仓配.txt', label: '小红书', color: '#ec4899' },
  { key: 'high_end', file: '04_高客单价_高端品牌履约.txt', label: '高客单价', color: '#8b5cf6' },
  { key: 'multi_sku', file: '05_非标品_多SKU_多规格管理.txt', label: '多SKU', color: '#6366f1' },
  { key: 'self_to_cloud', file: '06_自发货转云仓临界点.txt', label: '自发货转云仓', color: '#3b82f6' },
  { key: 'live_ecom', file: '07_直播电商_视频号电商_抖音电商履约.txt', label: '直播电商', color: '#0ea5e9' },
  { key: 'regional', file: '08_区域云仓_广州华南广东珠三角.txt', label: '区域云仓', color: '#06b6d4' },
  { key: 'sla', file: '09_云仓SLA_服务边界.txt', label: '云仓SLA', color: '#14b8a6' },
  { key: 'wms', file: '10_WMS库存可视化细分词.txt', label: 'WMS库存', color: '#10b981' },
  { key: 'comparison', file: '11_对比型长尾词.txt', label: '对比型', color: '#22c55e' },
  { key: 'beauty', file: '12_美妆护肤香水仓配.txt', label: '美妆护肤', color: '#84cc16' },
  { key: 'gifts', file: '13_礼盒饰品潮玩仓配.txt', label: '礼盒潮玩', color: '#a3e635' },
  { key: 'returns', file: '14_退货逆向物流_售后仓配.txt', label: '退货逆向', color: '#facc15' },
  { key: 'promo', file: '15_大促爆单预售履约.txt', label: '大促爆单', color: '#f59e0b' },
];

function readTitlesFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  } catch (e) {
    return [];
  }
}

let poolWithCategoryCache = null;
let poolCacheTime = 0;
let poolCacheKey = '';
let poolSourceCache = { type: 'none', name: 'none' };
const CACHE_TTL = 60000; // 1 minute

function resolveRootPath(filePath) {
  if (!filePath) return '';
  return path.isAbsolute(filePath) ? filePath : path.resolve(ROOT_DIR, filePath);
}

function getConfiguredKeywordDir() {
  return process.env.KEYWORD_TITLE_OUTPUTS_DIR
    ? resolveRootPath(process.env.KEYWORD_TITLE_OUTPUTS_DIR)
    : DEFAULT_KEYWORD_DIR;
}

function getPoolCacheKey() {
  return getConfiguredKeywordDir();
}

function readCategorizedPoolFromDir(dirPath) {
  const result = [];
  for (const cat of POOL_CATEGORIES) {
    const titles = readTitlesFile(path.join(dirPath, cat.file));
    for (const title of titles) {
      result.push({
        title,
        category: cat.key,
        categoryLabel: cat.label,
        categoryColor: cat.color,
      });
    }
  }
  return result;
}

function readAggregatePoolFile(filePath) {
  return readTitlesFile(filePath).map(title => ({
    title,
    category: AGGREGATE_POOL_CATEGORY.key,
    categoryLabel: AGGREGATE_POOL_CATEGORY.label,
    categoryColor: AGGREGATE_POOL_CATEGORY.color,
  }));
}

function getPoolSourceCandidates() {
  const configuredDir = getConfiguredKeywordDir();
  const aggregateFiles = [];

  if (process.env.KEYWORD_TITLE_OUTPUTS_DIR) {
    aggregateFiles.push(path.join(configuredDir, 'all_titles.txt'));
  }

  for (const filePath of FALLBACK_POOL_FILES) {
    if (!aggregateFiles.includes(filePath)) {
      aggregateFiles.push(filePath);
    }
  }

  return {
    categoryDir: configuredDir,
    aggregateFiles,
  };
}

function describePoolFile(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  if (relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)) {
    return relativePath.replace(/\\/g, '/');
  }
  return path.basename(filePath);
}

function loadPoolWithCategories() {
  const candidates = getPoolSourceCandidates();
  const categorized = readCategorizedPoolFromDir(candidates.categoryDir);
  if (categorized.length > 0) {
    poolSourceCache = {
      type: 'category_files',
      name: process.env.KEYWORD_TITLE_OUTPUTS_DIR ? 'KEYWORD_TITLE_OUTPUTS_DIR' : 'keyword_title_outputs',
    };
    return categorized;
  }

  for (const filePath of candidates.aggregateFiles) {
    const titles = readAggregatePoolFile(filePath);
    if (titles.length > 0) {
      poolSourceCache = {
        type: 'aggregate_file',
        name: describePoolFile(filePath),
      };
      return titles;
    }
  }

  poolSourceCache = { type: 'none', name: 'none' };
  return [];
}

function getPoolWithCategories() {
  const now = Date.now();
  const cacheKey = getPoolCacheKey();
  if (poolWithCategoryCache && poolCacheKey === cacheKey && (now - poolCacheTime) < CACHE_TTL) {
    return poolWithCategoryCache;
  }

  poolWithCategoryCache = loadPoolWithCategories();
  poolCacheTime = now;
  poolCacheKey = cacheKey;
  return poolWithCategoryCache;
}

function buildCategoryStats(allTitles) {
  const categoryStats = {};
  for (const cat of POOL_CATEGORIES) {
    const count = allTitles.filter(t => t.category === cat.key).length;
    if (count > 0) {
      categoryStats[cat.key] = {
        label: cat.label,
        color: cat.color,
        count,
      };
    }
  }

  const aggregateCount = allTitles.filter(t => t.category === AGGREGATE_POOL_CATEGORY.key).length;
  if (aggregateCount > 0 || Object.keys(categoryStats).length === 0) {
    categoryStats[AGGREGATE_POOL_CATEGORY.key] = {
      label: AGGREGATE_POOL_CATEGORY.label,
      color: AGGREGATE_POOL_CATEGORY.color,
      count: aggregateCount,
    };
  }
  return categoryStats;
}

function handleSelectedTitles(req, res) {
  const result = [];
  for (const item of SELECTED_FILES) {
    const titles = readTitlesFile(path.join(DATA_DIR, item.file));
    for (const title of titles) {
      result.push({
        title,
        category: item.key,
        categoryLabel: item.label,
        categoryColor: item.color,
      });
    }
  }

  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify({ total: result.length, titles: result }));
}

function handlePoolTitles(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1);
  const size = Math.min(100, Math.max(10, parseInt(url.searchParams.get('size')) || 50));
  const search = (url.searchParams.get('search') || '').toLowerCase();
  const category = url.searchParams.get('category') || '';

  let titles = getPoolWithCategories();

  if (category) {
    titles = titles.filter(t => t.category === category);
  }

  if (search) {
    titles = titles.filter(t => t.title.toLowerCase().includes(search));
  }

  const total = titles.length;
  const totalPages = Math.ceil(total / size);
  const start = (page - 1) * size;
  const paged = titles.slice(start, start + size).map((t, i) => ({
    title: t.title,
    category: t.category,
    categoryLabel: t.categoryLabel,
    categoryColor: t.categoryColor,
    index: start + i + 1,
  }));

  // Category stats
  const allTitles = getPoolWithCategories();
  const categoryStats = buildCategoryStats(allTitles);

  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify({
    total,
    page,
    size,
    totalPages,
    titles: paged,
    categories: categoryStats,
    source: poolSourceCache,
  }));
}

module.exports = {
  handleSelectedTitles,
  handlePoolTitles,
  SELECTED_FILES,
  POOL_CATEGORIES,
  AGGREGATE_POOL_CATEGORY,
  buildCategoryStats,
  getConfiguredKeywordDir,
  getPoolWithCategories,
  readAggregatePoolFile,
  resolveRootPath,
};
