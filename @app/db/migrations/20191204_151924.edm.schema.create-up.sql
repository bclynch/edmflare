create schema edm;
grant usage on schema edm to :DATABASE_VISITOR;
alter default privileges in schema edm grant usage, select on sequences to :DATABASE_VISITOR;
