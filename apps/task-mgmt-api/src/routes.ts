import { Router } from 'express';
import { updateProfile } from './handlers/user';
import { upload } from './middleware/upload';

const router: Router = Router();

// User Routes
router.patch('/user/profile', upload.single('file'), updateProfile);

export default router;
