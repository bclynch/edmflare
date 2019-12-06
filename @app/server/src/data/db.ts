import pg from 'pg';
require('dotenv').config();

const localConfig = {
  user: process.env.DATABASE_OWNER, // name of the user account
  database: process.env.DATABASE_NAME, // name of the database
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

const rdsConfig = {
  host: process.env.DATABASE_ADDRESS,
  port: 5432,
  user: process.env.NODE_DB_SUPER_USER,
  password: process.env.NODE_DB_SUPER_PASSWORD,
  database: process.env.DATABASE_NAME
}

const pool = process.env.NODE_ENV === 'production' ? new pg.Pool(rdsConfig) : new pg.Pool(localConfig);

export default {
  query: (sql: string, params?: any, callback?: any) => {
    return pool.query(sql, params, callback)
  }
}