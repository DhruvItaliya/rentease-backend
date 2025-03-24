import express from 'express';
import auth from '../../middlewares/auth.middleware.js'
import { getRentalAgreements } from '../../controllers/agreement.controller.js';
const router = express.Router();

router.get('/get-rental-items', auth, getRentalAgreements);

export default router;