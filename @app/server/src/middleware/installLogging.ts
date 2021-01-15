import morgan from 'morgan';
import { Express } from 'express';

const isDev = process.env.NODE_ENV === 'development';

export default (app: Express) => {
  app.use(morgan(isDev ? 'tiny' : 'combined'));
};
