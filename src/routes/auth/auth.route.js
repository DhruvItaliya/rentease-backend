import express from 'express';
import { signUp, signIn } from '../../controllers/auth.controller.js';
import { signUpValidation, signInValidation } from './auth.validations.js';

const router = express.Router();

router.post('/signup', signUpValidation, signUp);
router.get('/signin', signInValidation, signIn);

export default router;