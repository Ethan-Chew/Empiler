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

router.route('/remindertypes')
    .get(AppointmentController.getAppointmentReminderTypes)

router.route('/reminders/:id')
    .get(AppointmentController.getAppointmentReminders)
    .delete(AppointmentController.deleteAppointmentReminder);

router.route('/reminders')
    .put(AppointmentController.updateAppointmentReminder)
    .post(AppointmentController.setAppointmentReminder);

router.route('/openingHours')
    .get(AppointmentController.getOpeningHours);

router.route("/")

export default router;