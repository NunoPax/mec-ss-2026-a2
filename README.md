# MEC-SS Assignment 2

This repository contains the implementation for Assignment 2 of the Secure
Software course. The assignment brief remains the source of truth for the
required functionality, vulnerabilities, assessment tools, exploits, and
report.

## Stack

- `frontend/` — React application built with Vite;
- `backend/` — Node.js and Express JSON API;
- `postgresql/` — PostgreSQL image and assignment schema;
- `compose.yaml` — development environment for all three services.

## Run the development environment

Requirements:

- Docker Desktop with Docker Compose;
- Git.

From the repository root:

```sh
docker compose up --build
```

Open the frontend at <http://localhost:5173>. The API is available at
<http://localhost:3000/api>, and its database-aware health check is available
at <http://localhost:3000/api/health>.

To stop the services, press `Ctrl+C`. To remove the containers and the
development database volume:

```sh
docker compose down -v
```

The `-v` option resets the database and should only be used when that is
intended.

## Development model

The frontend and backend source directories are mounted into their containers,
so Vite and nodemon reload source changes during development. The PostgreSQL
schema is initialized when its data volume is created for the first time.

The backend waits for PostgreSQL's health check before starting. The frontend
proxies `/api` requests to the backend service inside the Compose network.
