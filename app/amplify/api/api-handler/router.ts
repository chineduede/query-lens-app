import createApi, { NextFunction, Request, Response } from 'lambda-api';
import { AccountHandler } from '../handlers/AccountHandler';

const api = createApi({version: 'v1'});

// Add Middleware
api.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Middleware', JSON.stringify(req, null, 2));
  next();
});

// Add routes
api.get('/accounts', AccountHandler)

export default api;
