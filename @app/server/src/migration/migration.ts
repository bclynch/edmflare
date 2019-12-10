import pg from 'pg';
import chalk from 'chalk';
import sanitize from '../utils/sanitize';

// const existingRDSConfig = {
//   host: process.env.DATABASE_ADDRESS,
//   port: 5432,
//   user: process.env.NODE_DB_SUPER_USER,
//   password: process.env.NODE_DB_SUPER_PASSWORD,
//   database: process.env.DATABASE_NAME
// };

// const newRDSConfig = {
//   host: process.env.DATABASE_ADDRESS,
//   port: 5432,
//   user: process.env.NODE_DB_SUPER_USER,
//   password: process.env.NODE_DB_SUPER_PASSWORD,
//   database: process.env.DATABASE_NAME
// };

// testing local dbs
const existingRDSConfig = {
  user: 'edm_super', // name of the user account
  database: 'edm', // name of the database
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

const newRDSConfig = {
  user: 'edm_xyz', // name of the user account
  database: 'edm_xyz', // name of the database
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

const existingDB = new pg.Pool(existingRDSConfig);
const newDB = new pg.Pool(newRDSConfig);

const schema = 'edm';

const cachedCities: any = {};
const cachedVenues: any = {};

interface tableArrType {
  table: string;
  map: object;
  // if the new table has a different name can identify it here
  newTable?: string;
};

// object should be a map of NEW DBs col header (key) to existing (if any) col header
// that way we can run a check against existing row data / obj for data
// need these to be in the order they are created to avoid sql issues with refs
const tablesArr: tableArrType[] = [
  {
    table: 'artist',
    map: {
      name: 'name',
      description: 'description',
      photo: 'photo',
      twitter_username: 'twitter_username',
      twitter_url: 'twitter_url',
      facebook_username: 'facebook_username',
      facebook_url: 'facebook_url',
      instagram_username: 'instagram_username',
      instagram_url: 'instagram_url',
      soundcloud_username: 'soundcloud_username',
      soundcloud_url: 'soundcloud_url',
      youtube_username: 'youtube_username',
      youtube_url: 'youtube_url',
      spotify_url: 'spotify_url',
      homepage: 'homepage'
    }
  },
  {
    table: 'city',
    map: {
      id: 'id',
      name: 'name',
      description: 'description',
      photo: 'photo',
      region: 'region',
      country: 'country',
    }
  },
  {
    table: 'venue',
    map: {
      name: 'name',
      description: 'description',
      lat: 'lat',
      lon: 'lon',
      city: 'city',
      address: 'address',
      photo: 'photo',
      logo: 'logo',
    }
  },
  {
    table: 'event',
    map: {
      id: 'id',
      venue: 'venue',
      city: 'city',
      region: 'region',
      country: 'country',
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
  },
  {
    table: 'artist_to_event',
    map: {
      artist_id: 'artist_id',
      event_id: 'event_id'
    }
  },
  {
    table: 'genre',
    map: {
      name: 'name',
      description: 'description'
    }
  },
  {
    table: 'genre_to_artist',
    map: {
      genre_id: 'genre_id',
      artist_id: 'artist_id'
    }
  }
];

// snag all rows of table from existing db
const queryAllRows = (table: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    const sql = `BEGIN;SELECT * FROM ${schema}.${table}${table === 'city' ? ' ORDER BY id' : ''};COMMIT;`;
    existingDB.query(sql, (err: any, data: { rows: any }) => {
      if (err) reject(err);
      if (data) {
        console.log(chalk.green(`Fetched ${data[1].rows.length} from old ${schema}.${table} table`));
        resolve(data[1].rows);
      }
    });
  });
};

// if the value is a string we need to throw quotes around it for sql -- otherwise null
const sequelizeValue = (x: any): any => {
  if (typeof x === 'number' || typeof x === 'boolean') return x;
  if (typeof x === 'string') return `'${x}'`;
  return 'null';
};

const createRowValues = (map: any, row: any): string => (
  Object.values(map).map((val: any) => sequelizeValue(typeof row[val] === 'string' ? sanitize(row[val]) : row[val])).join(', ')
);

// create sql to insert newly mapped data from old db to new
const createInsertSql = (rows: any, { newTable, table, map }: tableArrType): string => {
  let sql = 'BEGIN;';

  // we are manually setting the sequence value for city since we want serialized behavior, but have old values
  if (table === 'city') {
    sql += `ALTER SEQUENCE edm.city_sequence RESTART WITH ${rows.length + 1};`
  }

  rows.forEach((row: any) => {
    // if it's venue OR city table we need to cache the rows to generate better locale info for our event table
    if (table === 'city') {
      cachedCities[row.id] = row;
    }
    if (table === 'venue') {
      cachedVenues[row.name] = row;
    }
    // generate locale info for event based on venue + city info
    if (table === 'event') {
      // city id integer for ref
      const city = cachedVenues[row.venue].city;
      row = { ...row, city, region: cachedCities[city].region, country: cachedCities[city].country };
    }

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
};

const mapSeries = async (iterable: tableArrType[], action: any) => {

  // loop through cities using synchronous processing of scraping promise
  for (const [index, x] of iterable.entries()) {
    console.log(`Processing table ${index + 1} of ${iterable.length} - ${x.table}`);
    try {
      await action(x);
    } catch (e) {
        console.error(e);
    }
  }

  console.log(chalk.blue.bold(`Successfully migrated DB with ${tablesArr.length} tables migrated`));
  console.timeEnd(chalk.cyan.bold('Total migration time'));
};

const migrateDB = () => {
  console.time(chalk.cyan.bold('Total migration time'));
  mapSeries(tablesArr, migrateTable);
};

export default migrateDB;
