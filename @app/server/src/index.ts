#!/usr/bin/env node
/* eslint-disable no-console */
import chalk from 'chalk';
import { createServer } from 'http';
import { makeApp, getShutdownActions } from './app';
// import { scrapeEvents } from './scraping/scrape';
// import migrateDB from './migration/migration';
import db from './data/db';

// @ts-ignore
const packageJson = require('../../../package.json');

async function main() {
  // Create our HTTP server
  const httpServer = createServer();

  // Make our application (loading all the middleware, etc)
  const app = await makeApp({ httpServer });

  // Add our application to our HTTP server
  httpServer.addListener('request', app);

  // set up cron job for scraping shows + sending new event emails
  // scrape.initScrapeCronJob();
  // email.initEmailCronJob();

  // scrapeEvents();
  // migrateDB();

  // test job creation via db call
  // can hopefully create simple wrapper for this
  const shows = [
    {
      venue: 'Majestic Theatre Madison - Madison, WI',
      event: 'Shallou,  Slow Magic',
      startDate: 'April 5th, 2019',
      id: 'L9AWv'
    },
    {
      venue: 'The Annex at The Red Zone Madison - Madison, WI',
      event: 'Barely Alive at The Annex',
      startDate: 'April 20th, 2019',
      id: 'pY7PX' },
    {
      venue: 'The Annex at The Red Zone Madison - Madison, WI',
      event: 'DMVU at The Annex',
      startDate: 'March 23rd, 2019',
      id: 'ERKyg'
    },
    {
      venue: 'Majestic Theatre Madison - Madison, WI',
      event: 'Shallou,  Slow Magic',
      startDate: 'April 5th, 2019',
      id: 'L9AWv'
    },
    {
      venue: 'The Annex at The Red Zone Madison - Madison, WI',
      event: 'Barely Alive at The Annex',
      startDate: 'April 20th, 2019',
      id: 'pY7PX' },
    {
      venue: 'The Annex at The Red Zone Madison - Madison, WI',
      event: 'DMVU at The Annex',
      startDate: 'March 23rd, 2019',
      id: 'ERKyg'
    }
  ];
  const sql = `
  SELECT graphile_worker.add_job(
    'event_updates',
    json_build_object(
      'shows', '${JSON.stringify(shows)}',
      'email', 'coolio@aol.com'
    )
  );
  `;
  // const payload = {
  //   test: 'This email thing works. Neat.',
  //   email: 'boobs@aol.com'
  // }
  // const sql = `
  // SELECT graphile_worker.add_job(
  //   'user__welcome_email',
  //   json_build_object(
  //     'test', '${payload.test}',
  //     'email', '${payload.email}'
  //   )
  // );
  // `;
  // db.query(sql, (err: any, data: { rows: any }) => {
  //   if (err) console.log(err);
  //   console.log('DATA FROM JOB QUERY: ', data);
  // });

  // And finally, we open the listen port
  const PORT = parseInt(process.env.PORT || '', 10) || 3000;
  httpServer.listen(PORT, () => {
    const address = httpServer.address();
    const actualPort: string =
      typeof address === 'string'
        ? address
        : address && address.port
        ? String(address.port)
        : String(PORT);
    console.log();
    console.log(
      chalk.green(
        `${chalk.bold(packageJson.name)} listening on port ${chalk.bold(
          actualPort
        )}`
      )
    );
    console.log();
    console.log(
      `  Site:     ${chalk.bold.underline(`http://localhost:${actualPort}`)}`
    );
    console.log(
      `  GraphiQL: ${chalk.bold.underline(
        `http://localhost:${actualPort}/graphiql`
      )}`
    );
    console.log();
  });

  // Nodemon SIGUSR2 handling
  const shutdownActions = getShutdownActions(app);
  shutdownActions.push(() => {
    httpServer.close();
  });
}

main().catch(e => {
  console.error('Fatal error occurred starting server!');
  console.error(e);
  process.exit(101);
});
