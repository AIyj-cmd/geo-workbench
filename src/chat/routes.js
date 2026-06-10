const { MODEL_CATALOG } = require('../config');
const { sendError, sendJson } = require('../http/responses');
const { proxyToUpstream } = require('./proxy');
const { validateChatPayload } = require('./validation');

function readRequestBody(req, limitBytes) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    let rejected = false;
    req.on('data', chunk => {
      if (rejected) return;
      size += chunk.length;
      if (size > limitBytes) {
        rejected = true;
        reject(Object.assign(new Error('Request body too large'), { statusCode: 413, code: 'BODY_TOO_LARGE' }));
        return;
      }
      body += chunk;
    });

    req.on('end', () => {
      if (!rejected) resolve(body);
    });
    req.on('error', error => {
      if (!rejected) reject(error);
    });
  });
}

async function handleChatProxy(req, res, config) {
  if (!config.apiKey) {
    sendError(res, 500, 'API_KEY_NOT_CONFIGURED', 'API Key not configured on server');
    return;
  }

  try {
    const body = await readRequestBody(req, config.bodyLimitBytes);
    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      sendError(res, 400, 'INVALID_JSON', 'Request body must be valid JSON');
      return;
    }

    const validation = validateChatPayload(payload, config);
    if (validation.error) {
      sendError(res, 400, 'INVALID_REQUEST', validation.error);
      return;
    }

    proxyToUpstream(validation.value, config, res);
  } catch (error) {
    if (error.statusCode === 413) {
      sendError(res, 413, 'BODY_TOO_LARGE', 'Request body too large');
      return;
    }
    if (!res.headersSent) {
      console.error('Request read error:', error.message);
      sendError(res, 400, 'REQUEST_READ_ERROR', 'Failed to read request body');
    }
  }
}

function handleStatus(res, config) {
  sendJson(res, 200, {
    configured: !!config.apiKey,
    endpoint: config.apiUrl,
    chatModels: config.allowedChatModels,
    models: MODEL_CATALOG,
  });
}

module.exports = {
  handleChatProxy,
  handleStatus,
  readRequestBody,
};
