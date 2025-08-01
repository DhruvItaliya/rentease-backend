import express from 'express';
import authRoutes from './auth/auth.route.js';
import productRoutes from './product/product.route.js';
import requestRoutes from './request/request.route.js'
import agreementRoutes from './agreement/agreement.route.js'
import userRoutes from './user/user.route.js'
import reviewRoutes from './review/review.route.js'
import dashboardRoutes from './dashboard/dashboard.route.js'
import notificationRoutes from './notification/notification.route.js'
import disputeRoutes from './disputes/disputes.route.js'

const router = express.Router();

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/product', productRoutes)
router.use('/request', requestRoutes)
router.use('/rentals', agreementRoutes)
router.use('/review', reviewRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/notification', notificationRoutes)
router.use('/disputes', disputeRoutes)

export default router;  