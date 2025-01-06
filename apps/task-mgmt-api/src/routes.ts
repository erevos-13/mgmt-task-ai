import { Router } from 'express';
import { body, validationResult } from 'express-validator';

const router: Router = Router();

router.get('/user', (req, res) => {
  res.send({ message: 'Hello' });
});

export default router;
