import { Task } from 'graphile-worker';
import { SendEmailPayload } from './send_email';

interface ContactEmailPayload {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const task: Task = async (inPayload, { addJob }) => {
  const payload: ContactEmailPayload = inPayload as any;
  const { name, email, topic, message } = payload;

  const sendEmailPayload: SendEmailPayload = {
    options: {
      to: 'bclynch7@gmail.com',
      from: '"EDM Flare " <mail@edmflare.com>',
      subject: `${topic} Contact Request`,
    },
    template: 'contact.mjml',
    variables: {
      name,
      email,
      topic,
      message
    }
  };
  await addJob('send_email', sendEmailPayload);
};

module.exports = task;
