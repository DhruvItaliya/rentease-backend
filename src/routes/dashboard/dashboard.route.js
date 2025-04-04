import express from 'express';
import auth from '../../middlewares/auth.middleware.js'
import { categoryTrends, getRevenue, getStats } from '../../controllers/dashboard.controller.js';
const router = express.Router();

router.get('/get-dashboard', auth, categoryTrends);

export default router;