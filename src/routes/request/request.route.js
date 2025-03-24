import express from 'express';
import auth from '../../middlewares/auth.middleware.js'
import { cancelRequest, getRentalReuqests, makeRequest, approveRequest, rejectRequest, makePayment, returnProduct } from '../../controllers/request.controller.js';
const router = express.Router();

router.post('/makeRequest', auth, makeRequest);
router.patch('/cancelRequest', auth, cancelRequest);
router.get('/get-rental-request', auth, getRentalReuqests);
router.patch('/approve-request', auth, approveRequest);
router.patch('/reject-request', auth, rejectRequest);
router.patch('/cancel-request', auth, cancelRequest);
router.post('/make-payment', auth, makePayment);
router.patch('/return-product', auth, returnProduct);

export default router;