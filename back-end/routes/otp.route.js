import express from 'express';
import otpController from '../controllers/otp.controller.js';

const router = express.Router();

router.route('/get/')
    .post(otpController.getOtp);

router.route('/create')
    .post(otpController.createOtp);

router.route('/verify')
    .post(otpController.verifyOtp);

router.route('/delete')
    .delete(otpController.deleteOtp);

router.route('/enable')
    .post(otpController.enableOtp);

export default router;