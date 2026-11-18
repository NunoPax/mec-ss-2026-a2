# PostgreSQL service

PostgreSQL is started as part of the root Compose environment. Its schema is
loaded from `ddss-db-schema-pg.sql` when the database volume is initialized.

From the repository root, start the complete stack with:

```sh
docker compose up --build
```

The local development defaults are:

- User: `ddss-database-assignment-2`
- Password: `ddss-database-assignment-2`
- Database: `ddss-database-assignment-2`
- Host: `localhost:5432`

To re-run the schema from scratch, stop the stack and remove its volume:

```sh
docker compose down -v
docker compose up --build
```
