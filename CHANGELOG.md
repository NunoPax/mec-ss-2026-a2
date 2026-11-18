# Changelog

## [Unreleased]

### Added

- Separated the Node.js backend into application, configuration, database, error-handling, and validation modules.
(Not used to have all in a single repo anymore)
- Added centralized config for backend and removed database credential fallbacks from application code.

### Evidence retain

- PostgreSQL contains the tables `books`, `messages`, and `users`.
- The `users` table contains `username`, `password`, and `salt` columns.
- `username` is the primary key of `users`.
- The `users` table currently contains zero rows.

## [0.3.0] - 2026-11-18

### Added

- Added the React frontend.
- Added the Node.js and Express backend.
- Added Docker Compose orchestration for PostgreSQL, backend, and frontend.

## [0.2.0] - 2026-11-18

### Removed

- Removed unused legacy code.
- Removed obsolete scripts and Compose files.
