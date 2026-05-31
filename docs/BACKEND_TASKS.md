# Backend Tasks

Last updated: 2026-05-31

## Completed In This Iteration

- Reworked `server.js` into a testable CommonJS module while preserving `node server.js` startup.
- Split backend code into focused modules under `src/`: server assembly, configuration, HTTP helpers, static file serving, chat routes, chat validation, and upstream proxying.
- Added environment-driven server configuration for port, host, upstream API, request limit, timeout, rate limit, CORS origins, and chat model allowlist.
- Replaced direct static path joining with an explicit public-file allowlist.
- Added same-origin CORS enforcement with optional configured cross-origin allowlist.
- Added `/api/chat` JSON validation, model allowlist enforcement, parameter range checks, unknown-field stripping, request body size limit, upstream timeout, structured errors, and per-client rate limiting.
- Added `node:test` coverage for status, static serving, payload validation, upstream proxying, body limit, rate limit, and URL construction.
- Added `npm start` and replaced placeholder `npm test` with `node --test`.
- Added backend API, database, permission, and acceptance documentation.

## Current Backend Layout

- `server.js`: process entrypoint and compatibility exports for tests/tools.
- `src/app.js`: `createServer` and route dispatch.
- `src/config.js`: environment and `config.json` normalization.
- `src/http/responses.js`: structured JSON and error responses.
- `src/http/cors.js`: same-origin and configured-origin CORS checks.
- `src/http/rate-limit.js`: in-memory per-client rate limiting.
- `src/http/static-files.js`: public static file allowlist.
- `src/http/url.js`: request URL parsing.
- `src/chat/routes.js`: `/api/status` and `/api/chat` handlers.
- `src/chat/validation.js`: chat payload validation and sanitization.
- `src/chat/proxy.js`: upstream chat completions proxy.

## Deferred

- Authentication and authorization.
- Backend database persistence for questions, selling points, articles, platform versions, test records, and generation jobs.
- Migration from browser `localStorage` exports to backend storage.
- Admin-only system settings APIs.
- Audit log APIs.
- Production observability beyond console errors.

## Anti-Patterns Avoided

- No frontend files were changed.
- No hard-coded fake business data was added.
- No permission bypass was added.
- No admin token or user token storage was introduced.
- No unauthenticated mutable data persistence endpoint was added.
