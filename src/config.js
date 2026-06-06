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
const DEFAULT_ALLOWED_CHAT_MODELS = ['mimo-v2.5-pro', 'mimo-v2.5'];

const MODEL_CATALOG = [
  { id: 'mimo-v2.5-pro', type: 'text', desc: 'Advanced reasoning text generation' },
  { id: 'mimo-v2.5', type: 'text', desc: 'General purpose text generation' },
  { id: 'mimo-v2.5-tts-voiceclone', type: 'tts', desc: 'Voice clone' },
  { id: 'mimo-v2.5-tts-voicedesign', type: 'tts', desc: 'Voice design' },
  { id: 'mimo-v2.5-tts', type: 'tts', desc: 'Text to speech' },
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

  return {
    apiKey: options.apiKey || process.env.MIMO_API_KEY || fileConfig.apiKey || fileConfig.api_key || '',
    apiUrl: options.apiUrl || process.env.MIMO_API_URL || fileConfig.apiUrl || fileConfig.endpoint || DEFAULT_API_URL,
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

module.exports = {
  ROOT_DIR,
  DEFAULT_API_URL,
  MODEL_CATALOG,
  normalizeConfig,
  parseBoolean,
};
