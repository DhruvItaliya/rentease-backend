import express from 'express';
import auth from '../../middlewares/auth.middleware.js'
import { addProductNotification, getProductNotification } from '../../controllers/notification.controller.js';
const router = express.Router();

router.post('/add-product-notification', auth, addProductNotification);
router.get('/get-product-notification', auth, getProductNotification);

export default router;