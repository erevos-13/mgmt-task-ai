import { Router } from 'express';
import { updateProfile } from './handlers/user';
import { upload } from './middleware/upload';
import { createTask } from './handlers/tasks';
import { getTasks } from './handlers/tasks';

const router: Router = Router();

// User Routes
router.patch('/user/profile', upload.single('file'), updateProfile);

//Task Routes
router.post('/task', createTask);
router.get('/task', getTasks);

export default router;
