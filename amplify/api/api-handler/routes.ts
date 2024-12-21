import express, { Router } from 'express';
import { hello } from './route-handlers/hello';

const router: Router = express.Router();

router.get('/', hello);

export default router;
