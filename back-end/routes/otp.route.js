import express from 'express';
import otpController from '../controllers/otp.controller.js';

const router = express.Router();

router.route('/get/:email')
    .get(otpController.getOtp);

router.route('/create/:email')
    .post(otpController.createOtp);

router.route('/verify')
    .post(otpController.verifyOtp);

router.route('/delete')
    .delete(otpController.deleteOtp);

export default router;