import express from 'express';
import authRoutes from './auth/auth.route.js';
import productRoutes from './product/product.route.js';
import requestRoutes from './request/request.route.js'
import agreementRoutes from './agreement/agreement.route.js'
import userRoutes from './user/user.route.js'
import reviewRoutes from './review/review.route.js'

const router = express.Router();

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/product', productRoutes)
router.use('/request', requestRoutes)
router.use('/rentals', agreementRoutes)
router.use('/review', reviewRoutes)

export default router;  