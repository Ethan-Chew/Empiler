import express from 'express';
import AppointmentController from '../controllers/appointment.controller.js';

const router = express.Router();

router.route('/filter/:date/:branchName')
    .get(AppointmentController.filterAppointments);

router.route('/book')
    .post(AppointmentController.bookAppointment);

router.route('/viewbookings')
    .post(AppointmentController.getAllAppointments);

router.route('/update')
    .put(AppointmentController.updateAppointment);
    
router.route('/delete')
    .delete(AppointmentController.deleteAppointment);

router.route("/")

export default router;