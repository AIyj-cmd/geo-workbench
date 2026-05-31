# Permission Matrix

Last updated: 2026-05-31

## Scope

Permission implementation is intentionally deferred for this iteration per product direction. This document records the current behavior so it is not mistaken for a completed authorization model.

## Current Backend Behavior

| Endpoint | Visitor | Normal user | Admin | Banned user | Not logged in |
| --- | --- | --- | --- | --- | --- |
| `GET /api/status` | Allowed | Allowed | Allowed | Allowed | Allowed |
| `POST /api/chat` | Allowed, rate-limited | Allowed, rate-limited | Allowed, rate-limited | Allowed, rate-limited | Allowed, rate-limited |
| Static allowlisted files | Allowed | Allowed | Allowed | Allowed | Allowed |

## Current Denial Rules

- Non-same-origin browser requests are denied unless configured in `ALLOWED_ORIGINS`.
- Unsupported API paths return `404`.
- Unsupported static files return `404`.
- Unsupported request methods return `405`.
- Invalid chat payloads return `400`.
- Excessive chat volume returns `429`.

## Deferred Permission Requirements

When permissions are implemented:

- Admin endpoints must use httpOnly cookie validation.
- Normal user tokens must not access admin endpoints.
- Banned users should be denied mutable business actions.
- Unauthenticated users should receive `401` for protected APIs.
- Authenticated non-admin users should receive `403` for admin APIs.
- Admin token or session secrets must not be stored in `localStorage`.

