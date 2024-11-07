import express from 'express';
import * as AppointmentController from '../controllers/appointment.controller.js';

const router = express.Router();

// Get all available timeslots
router.get('/timeslots', AppointmentController.getAvailableTimeSlots);

// Book an appointment
router.post('/book', AppointmentController.bookAppointment);

export default router;
