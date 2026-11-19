# Changelog

## [0.4.0 ] - 2026-11-19

### Added

- Added a login endpoint and seed script.
- Added a minimal Material UI login page with React Router navigation to `/home` after login.

## [0.4.0 ] - 2026-11-18

### Added

- Separated the Node.js backend into application, configuration, database, error-handling, and validation modules.
(Not used to have all in a single repo anymore)

### Evidence retain

- PostgreSQL contains the tables `books`, `messages`, and `users`.
- The `users` table contains `username`, `password`, and `salt` columns.
- `username` is the primary key of `users`.
- The supplied screenshot records the `users` table before seeding, with zero rows.

## [0.3.0] - 2026-11-18

### Added

- Added the React frontend.
- Added the Node.js and Express backend.
- Added Docker Compose orchestration for PostgreSQL, backend, and frontend.

## [0.2.0] - 2026-11-18

### Removed

- Removed unused legacy code.
- Removed obsolete scripts and Compose files.
