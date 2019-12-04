# @app/db

We're using PostGraphile in a database-driven fashion in this project; so our
database is paramount. This package includes all the database migrations and
tests (using `jest`) for database functionality.

```
# modify db
yarn db migrate:create edm.tables.table_name
```
