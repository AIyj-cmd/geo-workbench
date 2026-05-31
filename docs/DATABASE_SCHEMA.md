# Database Schema

Last updated: 2026-05-31

## Current State

This repository currently has no backend database, migrations, ORM, or schema files. The existing application stores business data in browser `localStorage` under `geo_workbench_data` and `geo_workbench_settings`.

## Changes In This Backend Iteration

No database tables, fields, indexes, foreign keys, or migrations were added in this iteration.

Reason: permission/authentication was explicitly deferred, and adding unauthenticated mutable data APIs would expose question, article, and test-record data to public writes. Backend persistence should be implemented together with authentication, ownership, audit logging, and migration from existing browser exports.

## Compatibility Notes

- Existing browser `localStorage` data remains untouched.
- Existing JSON/Excel import and export behavior is not changed.
- No old data migration runs in this iteration.

## Recommended Next Migration

When permissions are in scope, add a real database migration with at least these backend-owned tables:

- `users`: login identity, role, banned status, timestamps.
- `questions`: keyword/question records currently stored in `state.questions`.
- `selling_points`: selling point records currently stored in `state.sellingPoints`.
- `articles`: generated master articles currently stored in `state.articles`.
- `platform_versions`: per-platform rewritten article content.
- `test_records`: AI-search test records currently stored in `state.testRecords`.
- `generation_jobs`: AI generation job status, model, token settings, request metadata.
- `audit_logs`: create/update/delete/import/export/admin events.
- `system_settings`: server-owned model allowlist and generation defaults.

Each future table must document field type, nullable policy, default value, unique constraint, indexes, foreign keys, delete policy, migration method, and compatibility strategy before implementation.

