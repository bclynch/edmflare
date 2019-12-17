import { Task } from 'graphile-worker';
import { SendEmailPayload } from './send_email';

interface ScrapeReportEmailPayload {
  test: string;
  email: string;
}

const task: Task = async (inPayload, { addJob }) => {
  const payload: ScrapeReportEmailPayload = inPayload as any;
  const { test, email } = payload;

  const sendEmailPayload: SendEmailPayload = {
    options: {
      to: email,
      from: '"EDM Flare " <mail@edmflare.com>',
      subject: 'Your nifty email',
    },
    template: 'welcome.mjml',
    variables: {
      test
    }
  };
  await addJob('send_email', sendEmailPayload);
};

module.exports = task;
