import express from 'express';
import helmet from 'helmet';
import router from './routes';

let app: express.Application;

export function ExpressApiSetup(): express.Application {
  if (app) {
    return app;
  }

  app = express();

  app.use('*', router);
  app.use(helmet());
  return app;
}
