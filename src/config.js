const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT_DIR, 'config.json');

const DEFAULT_PORT = 3010;
const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_API_URL = 'https://token-plan-sgp.xiaomimimo.com/v1';
const DEFAULT_BODY_LIMIT_BYTES = 2 * 1024 * 1024;
const DEFAULT_UPSTREAM_TIMEOUT_MS = 300000; // 5 minutes for parallel generation
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const DEFAULT_RATE_LIMIT_MAX = 120;
const DEFAULT_ALLOWED_CHAT_MODELS = ['mimo-v2.5-pro', 'mimo-v2.5', 'deepseek-chat', 'deepseek-reasoner'];

const MODEL_CATALOG = [
  { id: 'mimo-v2.5-pro', type: 'text', desc: 'Advanced reasoning text generation' },
  { id: 'mimo-v2.5', type: 'text', desc: 'General purpose text generation' },
  { id: 'mimo-v2.5-tts-voiceclone', type: 'tts', desc: 'Voice clone' },
  { id: 'mimo-v2.5-tts-voicedesign', type: 'tts', desc: 'Voice design' },
  { id: 'mimo-v2.5-tts', type: 'tts', desc: 'Text to speech' },
  { id: 'deepseek-chat', type: 'text', desc: 'DeepSeek V4 Pro' },
  { id: 'deepseek-reasoner', type: 'text', desc: 'DeepSeek V4 思考模式' },
];

function splitList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map(v => v.trim()).filter(Boolean);
  return String(value).split(',').map(v => v.trim()).filter(Boolean);
}

function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Failed to load ${path.basename(filePath)}:`, error.message);
    }
    return {};
  }
}

function normalizeConfig(options = {}) {
  const fileConfig = readJsonFile(options.configPath || CONFIG_PATH);
  const allowedChatModels = splitList(
    options.allowedChatModels ||
    process.env.CHAT_MODEL_ALLOWLIST ||
    fileConfig.allowedChatModels ||
    fileConfig.allowedModels
  );
  const allowedOrigins = splitList(
    options.allowedOrigins ||
    process.env.ALLOWED_ORIGINS ||
    fileConfig.allowedOrigins
  );

  // Provider-based routing: models matching a prefix use that provider's endpoint/key.
  // Unmatched models fall back to the default (MiMo) provider.
  const providerDefs = fileConfig.providers || {};
  const defaultProvider = {
    apiUrl: options.apiUrl || process.env.MIMO_API_URL || fileConfig.apiUrl || fileConfig.endpoint || DEFAULT_API_URL,
    apiKey: options.apiKey || process.env.MIMO_API_KEY || fileConfig.apiKey || fileConfig.api_key || '',
  };
  const providers = { __default: defaultProvider };
  for (const [name, pDef] of Object.entries(providerDefs)) {
    const prefixes = Array.isArray(pDef.modelPrefix) ? pDef.modelPrefix : [pDef.modelPrefix];
    const provider = { apiUrl: pDef.endpoint, apiKey: pDef.apiKey };
    for (const p of prefixes) {
      if (p) providers[p] = provider;
    }
  }

  return {
    ...defaultProvider,
    providers,
    port: Number(options.port || process.env.PORT || fileConfig.port || DEFAULT_PORT),
    host: options.host || process.env.HOST || fileConfig.host || DEFAULT_HOST,
    bodyLimitBytes: Number(options.bodyLimitBytes || process.env.BODY_LIMIT_BYTES || fileConfig.bodyLimitBytes || DEFAULT_BODY_LIMIT_BYTES),
    upstreamTimeoutMs: Number(options.upstreamTimeoutMs || process.env.UPSTREAM_TIMEOUT_MS || fileConfig.upstreamTimeoutMs || DEFAULT_UPSTREAM_TIMEOUT_MS),
    rateLimitWindowMs: Number(options.rateLimitWindowMs || process.env.RATE_LIMIT_WINDOW_MS || fileConfig.rateLimitWindowMs || DEFAULT_RATE_LIMIT_WINDOW_MS),
    rateLimitMax: Number(options.rateLimitMax || process.env.RATE_LIMIT_MAX || fileConfig.rateLimitMax || DEFAULT_RATE_LIMIT_MAX),
    trustProxy: parseBoolean(options.trustProxy ?? process.env.TRUST_PROXY ?? fileConfig.trustProxy, false),
    allowedChatModels: allowedChatModels.length ? allowedChatModels : DEFAULT_ALLOWED_CHAT_MODELS,
    allowedOrigins,
  };
}

function getProviderForModel(model, providers) {
  if (providers) {
    for (const [prefix, provider] of Object.entries(providers)) {
      if (prefix !== '__default' && model.startsWith(prefix)) return provider;
    }
    if (providers.__default) return providers.__default;
  }
  return { apiUrl: DEFAULT_API_URL, apiKey: '' };
}

module.exports = {
  ROOT_DIR,
  DEFAULT_API_URL,
  MODEL_CATALOG,
  normalizeConfig,
  parseBoolean,
  getProviderForModel,
};
