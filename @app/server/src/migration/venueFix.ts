// There was an issue for a bit in which a meta attr was being added to venue names during scrape
// This created a bunch of extraneous venue rows in the venue table and
// made the errant names appear on the event table. Need to delete the bad venue rows and fix
// the venue values on the new events

import pg from 'pg';
// import chalk from 'chalk';

// RDS configs
// const existingDbConfig = {
//   host: process.env.DATABASE_ADDRESS,
//   port: 5432,
//   user: process.env.NODE_DB_SUPER_USER,
//   password: process.env.NODE_DB_SUPER_PASSWORD,
//   database: process.env.DATABASE_NAME
// };

// testing local dbs
const existingDbConfig = {
  user: 'edm_super', // name of the user account
  database: 'edm_xyz', // name of the database
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

const existingDB = new pg.Pool(existingDbConfig);

const schema = 'edm';

let venues = {};

// snag all rows of events table with errant venue values
const queryEventsRows = (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    const sql = `BEGIN;SELECT * FROM ${schema}.event WHERE venue LIKE '%' || '<meta' || '%';COMMIT;`;
    existingDB.query(sql, (err: any, data: { rows: any }) => {
      if (err) reject(err);
      if (data) {
        resolve(data[1].rows);
      }
    });
  });
};

// grab venues to check if they exist later on
const fetchVenues = (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    const sql = `BEGIN;SELECT name FROM edm.venue;COMMIT;`;
    existingDB.query(sql, (err: any, data: { rows: any }) => {
      if (err) reject(err);
      if (data) {
        data[1].rows.forEach((venue: any) => {
          venues[venue] = {};
        });
        resolve();
      }
    });
  });
};

// const updateEvents = (): Promise<any> => {
//   return new Promise<any>((resolve, reject) => {
//     const sql = `BEGIN;SELECT * FROM ${schema}.event WHERE venue LIKE '%' || '<meta' || '%';COMMIT;`;
//     existingDB.query(sql, (err: any, data: { rows: any }) => {
//       if (err) reject(err);
//       if (data) {
//         resolve(data[1].rows);
//       }
//     });
//   });
// };

const venueFix = () => {
  fetchVenues().then(
    () => {
      queryEventsRows().then(
        (rows) => {
          // loop over rows and slice off desired venue name for ea event
          // if it exists then just update the venue col to be correct for this event id
          // if not then create venue and then update event

          // finally we want to delete the errant venues
        }
      );
    }
  );
}

export default venueFix;
