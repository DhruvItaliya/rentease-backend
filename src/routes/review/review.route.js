import express from 'express';
import auth from '../../middlewares/auth.middleware.js'
import { getReivews, addReivew, addHelpfulVotes } from '../../controllers/review.controller.js';
const router = express.Router();

router.get('/get-product-reviews', auth, getReivews);
router.post('/add-product-review', auth, addReivew);
router.patch('/helpful-vote/:reviewId', auth, addHelpfulVotes);

export default router;