import express from 'express';
import { getProducts, addProduct, uploadImage, getProductById, changeWishlist, getWishlist, updateProduct } from '../../controllers/product.controller.js';
import auth, { optionalAuth } from '../../middlewares/auth.middleware.js'
import { multerUpload } from '../../services/common.service.js';
const router = express.Router();

router.get('/get-products', optionalAuth, getProducts);
router.post('/add-product', auth, addProduct);
router.post('/upload-product-image', auth, multerUpload('products').single('product'), uploadImage);
router.get('/get-product-by-id/:productId', auth, getProductById);
router.patch('/like/:productId', auth, changeWishlist);
router.get('/get-wishlist', auth, getWishlist);
router.patch('/update-product/:productId', auth, updateProduct);

export default router;