import express from 'express';
import { getProducts, addProduct, uploadImage, getProductById } from '../../controllers/product.controller.js';
import auth from '../../middlewares/auth.middleware.js'
import { multerUpload } from '../../services/common.service.js';
const router = express.Router();

router.get('/get-products', getProducts);
router.post('/add-product', auth, addProduct);
router.post('/upload-product-image', auth, multerUpload('products').single('product'), uploadImage);
router.get('/get-product-by-id/:productId', auth, getProductById);

export default router;