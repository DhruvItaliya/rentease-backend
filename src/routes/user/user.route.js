import express from 'express';
import { getAddress, getProfile } from '../../controllers/user.controller.js';
import auth from '../../middlewares/auth.middleware.js'
const router = express.Router();

router.get('/get-address', auth, getAddress);
router.get('/get-profile', auth, getProfile);

export default router;