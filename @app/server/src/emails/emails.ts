// require('dotenv').config();
// import nodemailer from 'nodemailer';
// import aws from 'aws-sdk';
// import chalk from 'chalk';
// import db from '../data/db';
// import moment from 'moment';
// import express from 'express';
// import frequency from '../utils/frequency';
// const CronJob = require('cron').CronJob;
// const router = express.Router();
// const hbs = require('nodemailer-express-handlebars');

// let transporter = nodemailer.createTransport({
//   SES: new aws.SES({
//       apiVersion: '2010-12-01',
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//       region : 'us-east-1',
//   }),
//   sendingRate: 1 // max 1 messages/second
// });

// const handlebarOptions = {
//   viewEngine: {
//     extName: '.hbs',
//     partialsDir: './emailTemplates',
//     layoutsDir: './emailTemplates',
//     // defaultLayout: 'email.body.hbs',
//   },
//   viewPath: './emailTemplates',
//   extName: '.hbs',
// };

// transporter.use('compile', hbs(handlebarOptions));

// function initEmailCronJob() {
//   // setup job to fire every night to process new event emails 6am EST (10am UTC server time)
//   const job = new CronJob('00 00 10 * * *', () => sendNewEventsEmail());
//   job.start();
//   console.log(chalk.magenta('Email cron job inited'));
// }

// router.post('/contact', (req, res) => {
//   const data = req.body.data;
//   // might be wise to save this in a table eventually and can answer via admin dash, but for now this is fine
//   const mailOptions = {
//     to: 'mail@edmflare.com',
//     from: '"EDM Flare Contact" <support@edmflare.com>',
//     subject: `${req.body.data.topic} Contact Request`,
//     template: 'contact',
//     context: {
//       name: data.name,
//       email: data.email,
//       topic: data.topic,
//       message: data.message
//     }
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) res.send({ error });
//     console.log('MESSAGE: ', info.response);
//     res.send({ result: 'Contact email sent' })
//   });
// });

// // this need to be run once a day on a cron job
// const sendNewEventsEmail = () => {
//   console.log(chalk.yellow('Starting to send out email updates...'));

//   // list of frequencies we want to include for this push notification blast
//   // obviously every day would be included automatically
//   const frequencyArray = ['Every day'].concat(frequency());
//   // console.log('FREQUENCY ARRAY: ', frequencyArray);
//   let promiseArr = [];

//   // this should be running at about the same time of day every time so this method with moment will work great to make sure we capture all new
//   const frequencyObj = {
//     'Every day': moment().subtract(1, 'days').valueOf(),
//     // want to send mon, thurs, and sat
//     // so subtracting two days unless its thurs (4) in which case it's three
//     'Three times a week': moment().subtract(moment().day() === 4 ? 3 : 2, 'days').valueOf(),
//     // want to send mon, thurs
//     // so subtracting three days from thurs (4) and four from mon
//     'Two times a week': moment().subtract(moment().day() === 4 ? 3 : 4, 'days').valueOf(),
//     'Once a week': moment().subtract(7, 'days').valueOf(),
//     'Once every two weeks': moment().subtract(14, 'days').valueOf()
//   };
//   const emailObj = {};

//   // create promises for each sql call and run synchronously
//   frequencyArray.forEach((frequency) => {
//     let promise = new Promise((resolve) => {
//       let sql = `SELECT edm.users.id as user_id, edm_private.user_account.email, edm.venue.name as venue_name, edm.event.name as event_name, edm.event.start_date, edm.event.id as event_id
//         FROM edm.account
//         INNER JOIN edm.watched_to_account
//         ON edm.account.id = edm.watched_to_account.user_id
//         INNER JOIN edm.venue
//         ON edm.watched_to_account.city_id = edm.venue.city
//         INNER JOIN edm.event
//         ON edm.venue.name = edm.event.venue
//         INNER JOIN edm_private.user_account
//         ON edm.account.id = edm_private.user_account.user_id
//         WHERE email_notification = true
//         AND edm.event.created_at > ${frequencyObj[frequency]}
//         AND notification_frequency = '${frequency}'
//         ORDER BY start_date;`
//       ;

//       // ended up having to make my user, edm_admin, a superuser to allow it to look at edm_private email prop. Hopefully it doesn't
//       // jack up my security...
//       db.query(sql, (err, data) => {
//         if (err) console.log('ERR: ', err);
//         if (data) {
//           // console.log(`DB DATA FOR ${frequency}:`, data.rows);
//           // putting all the events in an object to use to send mail later
//           data.rows.forEach(({ venue_name, event_name, start_date, event_id, user_id, email }) => {
//             const showObj = {
//               venue: venue_name,
//               event: event_name,
//               startDate: moment(+start_date).format('ddd, MMM DD'),
//               id: event_id,
//               userId: user_id
//             };

//             if (emailObj[email]) {
//               emailObj[email].push(showObj);
//             } else {
//               emailObj[email] = [showObj];
//             }
//           });
//           resolve();
//         }
//       });
//     });
//     promiseArr.push(promise);
//   });
//   Promise.all(promiseArr)
//       .then(() => {
//         // console.log('EMAIL OBJ: ', emailObj);
//         // at this point we have a nice obj with emails as the keys and an array of new events after each
//         // create an arr of obj keys and we can feed them into mailing function
//         const emailsArr = Object.keys(emailObj);
//         while (transporter.isIdle() && emailsArr.length) {
//           // Identify who emailing to and remove from array
//           const email = emailsArr.shift();

//           // grab artists to add to email subject
//           let artists = '';
//           emailObj[email].forEach((event, i) => {
//             if (i < 3) artists += `${event.event}, `;
//           });
//           artists += 'and more!';

//           transporter.sendMail({
//             from: '"EDM Flare " <mail@edmflare.com>',
//             to: email,
//             subject: `💿 New EDM shows including ${artists}`,
//             template: 'new-shows',
//             context: { shows : emailObj[email], userId: emailObj[email][0].userId }
//           }, (err, info) => {
//             if (err) console.log('ERR: ', err);
//             console.log(info.envelope);
//           });
//         }
//       })
//       .catch((err) => console.log(err));
// }

// const emailScrapeResults = (citiesScraped, err) => {

//   const mailOptions = {
//     to: 'bclynch7@gmail.com',
//     from: '"EDM Flare Contact" <support@edmflare.com>',
//     subject: `${moment(new Date()).format('MM/DD')} Scrape Results -- ${Object.keys(err).length} Errors`,
//     template: 'email-scrape-results',
//     context: { citiesScraped, err: JSON.stringify(err, null, 4), numberErrors: Object.keys(err).length }
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) console.log({ error });
//     console.log('Email sent: ', info);
//   });
// }

// module.exports = {
//   initEmailCronJob,
//   emailScrapeResults,
//   router,
//   sendNewEventsEmail
// }
