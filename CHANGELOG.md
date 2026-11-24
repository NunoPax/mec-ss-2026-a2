# Changelog

## [0.6.0] - 23-11-2026

- Added message frontend and backend support 

## [0.5.0] - 22-11-2026

### Added

- MUI library
- Added Redux Toolkit for centralized frontend authentication state and transitions.
- Added protected message listing and submission using the authenticated session.

## [0.4.0 ] - 19-11-2026

### Added

- Added a login endpoint and seed script.
- Added a minimal Material UI login page with React Router navigation to `/home` after login.
- Added a PostgreSQL HTTP only session with session restoration and logout handling.

## [0.4.0 ] - 18-11-2026

### Added

- Separated the Node.js backend into application, configuration, database, error-handling, and validation modules.
(Not used to have all in a single repo anymore)

### Evidence retain

- PostgreSQL contains the tables `books`, `messages`, and `users`.
- The `users` table contains `username`, `password`, and `salt` columns.
- `username` is the primary key of `users`.
- The supplied screenshot records the `users` table before seeding, with zero rows.

## [0.3.0] - 18-11-2026

### Added

- Added the React frontend.
- Added the Node.js and Express backend.
- Added Docker Compose orchestration for PostgreSQL, backend, and frontend.

## [0.2.0] - 18-11-2026

### Removed

- Removed unused legacy code.
- Removed obsolete scripts and Compose files.
