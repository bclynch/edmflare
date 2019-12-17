import { Task } from 'graphile-worker';
import { SendEmailPayload } from './send_email';

interface EventUpdatesEmailPayload {
  shows: string;
  email: string;
}

const task: Task = async (inPayload, { addJob }) => {
  const payload: EventUpdatesEmailPayload = inPayload as any;
  const { shows, email } = payload;

  const parsedShows: {
    venue: string;
    event: string;
    startDate: string;
    id: string;
  }[] = JSON.parse(shows);

  // grab events to add to email subject
  let events = '';
  for(let i = 0; i < parsedShows.length; i++) {
    if (i < 3) {
      events += `${parsedShows[i].event}, `;
    } else {
      break;
    }
  }
  events += 'and more!';

  const sendEmailPayload: SendEmailPayload = {
    options: {
      to: email,
      from: '"EDM Flare " <mail@edmflare.com>',
      subject: `💿 New EDM shows including ${events}`,
    },
    template: 'event_updates.mjml',
    variables: {
      shows: parsedShows
    }
  };
  await addJob('send_email', sendEmailPayload);
};

module.exports = task;
