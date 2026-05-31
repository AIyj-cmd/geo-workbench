# Acceptance Criteria

Last updated: 2026-05-31

## Backend Security

- Static serving only exposes the allowlisted public files.
- Requests for `server.js`, `package.json`, `config.json`, docs, unknown paths, and traversal-like paths are not served.
- Cross-origin browser requests are denied unless the origin is same-origin or configured in `ALLOWED_ORIGINS`.
- JSON responses do not include the upstream API key.

## Chat Proxy

- `/api/chat` rejects invalid JSON.
- `/api/chat` rejects unsupported models.
- `/api/chat` rejects invalid roles, empty messages, excessive token settings, invalid temperature, and invalid penalty/top-p values.
- `/api/chat` strips unknown fields before upstream proxying.
- `/api/chat` enforces request body size limits.
- `/api/chat` enforces basic per-client rate limiting.
- `/api/chat` returns `504 UPSTREAM_TIMEOUT` when the upstream does not respond in time.
- Stream mode continues to forward SSE responses.

## Deployment

- Server port is configurable with `PORT`.
- Listen host is configurable with `HOST`.
- Upstream API URL and key can be configured with `MIMO_API_URL` and `MIMO_API_KEY`.
- Chat model allowlist can be configured with `CHAT_MODEL_ALLOWLIST`.

## Tests

- `npm test` must pass.
- `node --check server.js` must pass.
- `node --check src/**/*.js` must pass.
- `node --check tests/server.test.js` must pass.

## Backend Structure

- `server.js` remains a thin startup entrypoint.
- Backend business logic, request validation, HTTP helpers, static serving, and upstream proxying live in focused modules under `src/`.
- Existing public API behavior remains compatible with the frontend.

## Frontend Boundary

- No frontend page, component, CSS, layout, route visual structure, interaction animation, Pixel UI usage, or UI copy is changed in this iteration.
