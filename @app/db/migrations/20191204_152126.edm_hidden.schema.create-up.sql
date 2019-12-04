create schema edm_hidden;
grant usage on schema edm_hidden to :DATABASE_VISITOR;
alter default privileges in schema edm_hidden grant usage, select on sequences to :DATABASE_VISITOR;
