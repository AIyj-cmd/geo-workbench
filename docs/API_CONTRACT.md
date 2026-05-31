# API Contract

Last updated: 2026-05-31

This document describes the backend endpoints implemented by `server.js`. Frontend pages, components, styles, and copy are not changed by this backend iteration.

## GET /api/status

- Method: `GET`
- Path: `/api/status`
- Request body: none
- Admin required: no
- Permission requirement: none in this iteration
- Data validation: none
- Side effects: none
- Affects ranking/user state/review state/system settings: no

Response `200`:

```json
{
  "configured": true,
  "endpoint": "https://token-plan-sgp.xiaomimimo.com/v1",
  "chatModels": ["mimo-v2.5-pro", "mimo-v2.5"],
  "models": [
    { "id": "mimo-v2.5-pro", "type": "text", "desc": "Advanced reasoning text generation" }
  ]
}
```

Error responses:

- `403 CORS_ORIGIN_DENIED`: request origin is not same-origin and not present in `ALLOWED_ORIGINS`.

## POST /api/chat

- Method: `POST`
- Path: `/api/chat`
- Request body: JSON object
- Admin required: no
- Permission requirement: none in this iteration
- Side effects: proxies one upstream chat completion request to the configured MiMo-compatible endpoint
- Affects ranking/user state/review state/system settings: no

Request body:

```json
{
  "model": "mimo-v2.5-pro",
  "messages": [
    { "role": "system", "content": "system prompt" },
    { "role": "user", "content": "user prompt" }
  ],
  "max_tokens": 16000,
  "temperature": 0.7,
  "stream": true
}
```

Validation rules:

- `model`: required string, must be in `CHAT_MODEL_ALLOWLIST` or `config.json.allowedChatModels`; default: `mimo-v2.5-pro,mimo-v2.5`.
- `messages`: required array, 1 to 50 items.
- `messages[].role`: one of `system`, `user`, `assistant`.
- `messages[].content`: non-empty string, max 200000 characters.
- `max_tokens`: optional number from 1 to 65536.
- `temperature`: optional number from 0 to 2.
- `top_p`: optional number from 0 to 1.
- `presence_penalty`: optional number from -2 to 2.
- `frequency_penalty`: optional number from -2 to 2.
- `stream`: optional boolean.
- `stop`: optional string or array of up to 4 strings.
- Unknown fields are dropped before the upstream request.
- Request body limit defaults to 2 MiB and can be changed with `BODY_LIMIT_BYTES`.

Response body:

- Non-stream request: forwards the upstream JSON response body.
- Stream request: forwards the upstream SSE stream as `text/event-stream`.

Error responses:

- `400 INVALID_JSON`: request body is not valid JSON.
- `400 INVALID_REQUEST`: request body fails validation.
- `403 CORS_ORIGIN_DENIED`: origin is not allowed.
- `413 BODY_TOO_LARGE`: request body exceeds the configured limit.
- `429 RATE_LIMITED`: per-client chat request limit exceeded.
- `500 API_KEY_NOT_CONFIGURED`: server has no API key.
- `502 UPSTREAM_ERROR`: upstream request failed.
- `504 UPSTREAM_TIMEOUT`: upstream request exceeded `UPSTREAM_TIMEOUT_MS`.

## Static Files

Static file serving is intentionally allowlisted. Only these paths are served:

- `/`
- `/index.html`
- `/app.js`
- `/style.css`
- `/logo.jpg`
- `/favicon.ico`

Other repository files, including `server.js`, `package.json`, `config.json`, docs, and unknown paths, are not served.

## Configuration

Supported environment variables:

- `PORT`: server port, default `3010`.
- `HOST`: listen host, default `0.0.0.0`.
- `MIMO_API_KEY`: upstream API key.
- `MIMO_API_URL`: upstream base URL, default `https://token-plan-sgp.xiaomimimo.com/v1`.
- `CHAT_MODEL_ALLOWLIST`: comma-separated chat model allowlist.
- `ALLOWED_ORIGINS`: comma-separated CORS origin allowlist. Same-origin requests are always allowed.
- `BODY_LIMIT_BYTES`: max JSON request body size.
- `UPSTREAM_TIMEOUT_MS`: upstream request timeout.
- `RATE_LIMIT_WINDOW_MS`: rate-limit window.
- `RATE_LIMIT_MAX`: max chat requests per client per window.

