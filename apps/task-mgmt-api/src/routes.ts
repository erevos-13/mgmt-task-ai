import { Router } from 'express';
import { body } from 'express-validator';
const router: Router = Router();

router.get('/', (req, res) => {
  res.send({ message: 'Hello' });
});

export default router;
