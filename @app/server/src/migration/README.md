# Migration

## Issue

- We have an existing db with a good deal of data in it we want to move to our new db that is structured differently and has some differences in schema.
- There is probably a much easier way to accomplish this with some kind of `pg_dump` thing, but as it stands going to take a stab with a node script and the `pg` library.
- Should only have to do this once, but a useful exercise... (meh). Hopefully doing things "the right way" here and the addition of db-migrate will make this easier in the future.

## Plan

- Create an array of objects. Each object will be a table we need to migrate.
- From there we need a mapping of the existing col names to the new ones. Most will be the same.
- Create a connection to both the existing db and the new one with `pg`
- Query for all the rows for each table in the old existing db and then loop over the data mapping existing values into new values while making INSERT statements.
- ...
- Profit
