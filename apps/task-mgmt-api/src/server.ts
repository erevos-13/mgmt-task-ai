import express from 'express';
import * as path from 'path';
import routers from './routes';
const appExpress: express.Application = express();

appExpress.use(express.json());

appExpress.use(express.urlencoded({ extended: true }));
appExpress.use('/assets', express.static(path.join(__dirname, 'assets')));

appExpress.use('/api', routers);

appExpress.use((err: any, req: any, res: any, next: any) => {
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
