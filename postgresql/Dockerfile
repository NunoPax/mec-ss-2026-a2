#
# Authors: Nuno Antunes <nmsa@dei.uc.pt>, João Antunes <jcfa@dei.uc.pt>
#

FROM postgres:16-alpine

COPY ddss-db-schema-pg.sql /docker-entrypoint-initdb.d/001-schema.sql

EXPOSE 5432
