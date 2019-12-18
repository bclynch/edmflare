require('dotenv').config();
import chalk from 'chalk';
import db from '../data/db';
import moment from 'moment';
import express from 'express';
import frequency from '../utils/frequency';
import sanitize from '../utils/sanitize';
const CronJob = require('cron').CronJob;
const router = express.Router();

interface UserEventsQuery {
  venue_name: string;
  event_name: string;
  start_date: string;
  event_id: string;
  user_id: number;
  email: string;
}

export const initEmailCronJob = (): void => {
  // setup job to fire every night to process new event emails 6am EST (10am UTC server time)
  const job = new CronJob('00 00 10 * * *', () => sendNewEventsEmail());
  job.start();
  console.log(chalk.magenta('Email cron job inited'));
}

router.post('/contact', (req, res) => {
  const { name, email, topic, message } = req.body.data;
  // might be wise to save this in a table eventually and can answer via admin dash, but for now this is fine
  const sql = `
  SELECT graphile_worker.add_job(
    'contact',
    json_build_object(
      'name', '${name}',
      'email', '${email}',
      'topic', '${topic}',
      'message', '${message}',
    )
  );
  `;

  db.query(sql, (err: any) => {
    if (err) console.log(err);
    res.send({ result: 'Contact email sent' });
  });
});

// this need to be run once a day on a cron job
export const sendNewEventsEmail = (): void => {
  console.log(chalk.yellow('Starting to send out email updates...'));

  // list of frequencies we want to include for this push notification blast
  // obviously every day would be included automatically
  const frequencyArray = ['Every day'].concat(frequency());
  // console.log('FREQUENCY ARRAY: ', frequencyArray);
  let promiseArr: Promise<void>[] = [];

  // this should be running at about the same time of day every time so this method with moment will work great to make sure we capture all new
  const hoursPerDay = 24;
  const frequencyObj = {
    'Every day': hoursPerDay * 1,
    // want to send mon, thurs, and sat
    // so subtracting two days unless its thurs (4) in which case it's three
    'Three times a week': (moment().day() === 4 ? 3 : 2) * hoursPerDay,
    // want to send mon, thurs
    // so subtracting three days from thurs (4) and four from mon
    'Two times a week': (moment().day() === 4 ? 3 : 4) * hoursPerDay,
    'Once a week': 7 * hoursPerDay,
    'Once every two weeks': 14 * hoursPerDay
  };
  const emailObj = {};

  // create promises for each sql call and run synchronously
  frequencyArray.forEach((frequency) => {
    let promise: Promise<void> = new Promise((resolve) => {
      let sql = `
        SELECT DISTINCT edm.users.id as user_id, edm.user_emails.email, edm.event.venue as venue_name, edm.event.name as event_name, edm.event.start_date, edm.event.id as event_id
        FROM edm.users
        INNER JOIN edm.watched_to_account
        ON edm.users.id = edm.watched_to_account.user_id
        INNER JOIN edm.event
        ON edm.watched_to_account.city_id = edm.event.city
        OR edm.watched_to_account.region = edm.event.region
        INNER JOIN edm.user_emails
        ON edm.users.id = edm.user_emails.user_id
        WHERE email_notification = true
        AND notification_frequency = '${frequency}'
        AND edm.event.created_at >= NOW() - INTERVAL '${frequencyObj[frequency]} HOURS'
        ORDER BY start_date;
      `;

      // ended up having to make my user, edm_admin, a superuser to allow it to look at edm_private email prop. Hopefully it doesn't
      // jack up my security...
      db.query(sql, (err: any, data: { rows: UserEventsQuery[] }) => {
        if (err) console.log('ERR: ', err);
        if (data) {
          // console.log(`DB DATA FOR ${frequency}:`, data.rows);
          // putting all the events in an object to use to send mail later
          data.rows.forEach(({ venue_name, event_name, start_date, event_id, user_id, email }: UserEventsQuery) => {
            const showObj = {
              venue: sanitize(venue_name),
              event: event_name,
              startDate: moment(+start_date).format('ddd, MMM DD'),
              id: event_id,
              userId: user_id
            };

            if (emailObj[email]) {
              emailObj[email].push(showObj);
            } else {
              emailObj[email] = [showObj];
            }
          });
          resolve();
        }
      });
    });
    promiseArr.push(promise);
  });
  Promise.all(promiseArr)
      .then(() => {
        // console.log('EMAIL OBJ: ', emailObj);
        // at this point we have a nice obj with emails as the keys and an array of new events after each
        // create an arr of obj keys and we can feed them into mailing function
        const emailsArr = Object.keys(emailObj);
        while (emailsArr.length) {
          // Identify who emailing to and remove from array
          const email: any = emailsArr.shift();
          const shows = emailObj[email];

          const sql = `
          SELECT graphile_worker.add_job(
            'event_updates',
            json_build_object(
              'shows', '${JSON.stringify(shows)}',
              'email', '${email}'
            )
          );
          `;
          db.query(sql, (err: any) => {
            if (err) console.log(err);
          });
        }
      })
      .catch((err) => console.log(err));
}

module.exports = {
  router,
  initEmailCronJob,
  sendNewEventsEmail
}
