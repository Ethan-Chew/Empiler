import express from 'express';
import AppointmentController from '../controllers/appointment.controller.js';

const router = express.Router();

router.route('/filter/:date/:branchName')
    .get(AppointmentController.filterAppointments);

router.route('/book')
    .post(AppointmentController.bookAppointment);

router.route("/")

export default router;