import express, { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import routers from './routes';
import { protect } from './modules/auth';
import { register, signin } from './handlers/user';
import { validate } from './modules/middleware';
import { body } from 'express-validator';
import cors from 'cors';
import bodyParser from 'body-parser';
const appExpress: express.Application = express();

appExpress.use(cors());
appExpress.use(bodyParser.json());

appExpress.use(bodyParser.urlencoded({ extended: true }));
appExpress.use('/assets', express.static(path.join(__dirname, 'assets')));

appExpress.post(
  '/user/signup',
  validate([
    body('email').isEmail(),
    body('password').isLength({ min: 5 }).isString(),
  ]),
  register
);
appExpress.post('/user/signin', validate([body('email').isEmail()]), signin);

appExpress.use('/api/v1', protect, routers);

appExpress.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // handle error
  if (err.type === 'auth') {
    res.status(401).json({ error: 'Unauthorized' });
  } else if (err.type === 'input') {
    res.status(400).json({ error: 'Bad Request' });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
  console.error(err);
});

export default appExpress;
