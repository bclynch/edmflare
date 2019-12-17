import { Task } from 'graphile-worker';
import moment from 'moment';
import { SendEmailPayload } from './send_email';

interface ScrapeReportEmailPayload {
  dbErrors: object;
}

const task: Task = async (inPayload, { addJob }) => {
  const payload: ScrapeReportEmailPayload = inPayload as any;
  const { dbErrors } = payload;

  const numberErrors = Object.keys(dbErrors).length;
  const sendEmailPayload: SendEmailPayload = {
    options: {
      to: 'bclynch7@gmail.com',
      from: '"EDM Flare Contact" <support@edmflare.com>',
      subject: `${moment(new Date()).format('MM/DD')} Scrape Results -- ${numberErrors} Errors`,
    },
    template: 'scrape_report.mjml',
    variables: {
      errorLog: JSON.stringify(dbErrors),
      numberErrors
    }
  };
  await addJob('send_email', sendEmailPayload);
};

module.exports = task;
