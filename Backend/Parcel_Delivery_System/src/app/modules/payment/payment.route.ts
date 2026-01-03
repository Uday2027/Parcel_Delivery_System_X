import express from 'express';
import { confirmPayment, createPaymentIntent } from './payment.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = express.Router();

router.post('/create-intent', checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), createPaymentIntent);
router.post('/confirm', checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), confirmPayment);

export const paymentRoutes = router;
