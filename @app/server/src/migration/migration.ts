import pg from 'pg';
import chalk from 'chalk';

// const existingRDSConfig = {
//   host: process.env.DATABASE_ADDRESS,
//   port: 5432,
//   user: process.env.NODE_DB_SUPER_USER,
//   password: process.env.NODE_DB_SUPER_PASSWORD,
//   database: process.env.DATABASE_NAME
// }

// const newRDSConfig = {
//   host: process.env.DATABASE_ADDRESS,
//   port: 5432,
//   user: process.env.NODE_DB_SUPER_USER,
//   password: process.env.NODE_DB_SUPER_PASSWORD,
//   database: process.env.DATABASE_NAME
// }

// testing local dbs
const existingRDSConfig = {
  user: 'edm_super', // name of the user account
  database: 'edm', // name of the database
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
}

const newRDSConfig = {
  user: 'edm_xyz', // name of the user account
  database: 'edm_xyz', // name of the database
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
}

// example response for data.row
const ex = {
  id: 'M8NjP',
  venue: 'Skyway Theatre Bar Fly - Minneapolis, MN',
  name: 'Tripzy Leary',
  description: null,
  type: 'other',
  start_date: '1553745600000',
  end_date: null,
  ticketproviderid: null,
  ticketproviderurl: 'https://skywaytheatre.com/event/tripzy-leary/',
  banner: null,
  approved: true,
  contributor: null,
  created_at: '1553614817733',
  updated_at: '2019-03-26T12:40:17.732Z'
};

const existingDB = new pg.Pool(existingRDSConfig);
const newDB = new pg.Pool(newRDSConfig);

const schema = 'edm';

interface tableArrType {
  table: string;
  map: object;
  // if the new table has a different name can identify it here
  newTable?: string;
}

// object should be a map of NEW DBs col header (key) to existing (if any) col header
// that way we can run a check against existing row data / obj for data
// need these to be in the order they are created to avoid sql issues with refs
const tablesArr: tableArrType[] = [
  {
    table: 'account',
    newTable: 'users',
    map: {

    }
  },
  {
    table: 'event',
    map: {
      id: 'id',
      venue: 'venue',
      city: null, // need to populate this somehow... Can save the values when we fetch the venue info like we do in scrape
      region: null,
      country: null,
      name: 'name',
      description: 'description',
      type: 'type',
      start_date: 'start_date',
      end_date: 'end_date',
      ticketproviderid: 'ticketproviderid',
      ticketproviderurl: 'ticketproviderurl',
      banner: 'banner',
      approved: 'approved',
      contributor: 'contributor',
    }
  }
];

// snag all rows of table from existing db
const queryAllRows = (table: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    const sql = `BEGIN;SELECT * FROM ${schema}.${table};COMMIT;`;
    existingDB.query(sql, (err: any, data: { rows: any }) => {
      if (err) reject(err);
      if (data) {
        console.log(chalk.green(`Fetched ${data.rows.length} from old ${schema}.${table} table`));
        resolve(data.rows);
      }
    });
  });
};

// if the value is a string we need to throw quotes around it for sql -- otherwise null
const sequelizeValue = (x: string) => typeof x === 'string' ? `'${x}'` : null;

const createRowValues = (map, row) => {
  Object.values(map).map((val: string) => sequelizeValue(row[val])).join(', ')
}

// create sql to insert newly mapped data from old db to new
const createInsertSql = (rows: any, { newTable, table, map }: tableArrType): string => {
  let sql = 'BEGIN;';
  rows.forEach((row) => {
    sql += `INSERT INTO ${schema}.${newTable || table}(${Object.keys(map).join(', ')}) VALUES (${createRowValues(map, row)});`
  });
  sql += 'COMMIT;'
  return sql;
};

const migrateTable = (tableObj: tableArrType): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    queryAllRows(tableObj.table).then(
      (rows: any) => {
        const sql = createInsertSql(rows, tableObj);
        // execute the sql on our new db to add data
        newDB.query(sql, (err: any, data: any) => {
          if (err) reject({ err, sql });
          if (data) {
            console.log(chalk.green(`Added ${rows.length} rows to the new ${schema}.${tableObj.table} table`));
            resolve();
          }
        });
      },
      (err: any) => reject(err)
    )
  });
}

const mapSeries = async (iterable: tableArrType[], action: any) => {

  // loop through cities using synchronous processing of scraping promise
  for (const [index, x] of iterable.entries()) {
    console.log(`Processing table ${index + 1} of ${iterable.length} - ${x.table}`);
    await action(x)
  }

  console.log(chalk.blue.bold(`Successfully migrated DB with ${tablesArr.length} tables migrated`));
  console.timeEnd(chalk.cyan.bold('Total migration time'));
}

mapSeries(tablesArr, migrateTable);
