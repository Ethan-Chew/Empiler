import * as AppointmentModel from '../models/appointment.js';

// Get available timeslots
export const getAvailableTimeSlots = async (req, res) => {
    const { date } = req.query;
    console.log("Received date:", date);  // Log the date to check if it is passed correctly

    try {
        const timeslots = await AppointmentModel.getAllTimeSlots();
        const availableSlots = await Promise.all(timeslots.map(async (slot) => {
            const isAvailable = await AppointmentModel.isTimeSlotAvailable(date, slot.id);
            return isAvailable ? slot : null;
        }));
        res.json(availableSlots.filter(slot => slot !== null)); // Only return available slots
    } catch (error) {
        console.error("Error fetching time slots:", error);
        res.status(500).json({ error: 'Failed to fetch time slots.' });
    }
};

// Book an appointment
export const bookAppointment = async (req, res) => {
    const { name, date, timeslotId } = req.body;
    try {
        const isAvailable = await AppointmentModel.isTimeSlotAvailable(date, timeslotId);
        if (!isAvailable) {
            return res.status(400).json({ error: 'Time slot is already booked.' });
        }

        await AppointmentModel.bookAppointment(name, date, timeslotId);
        res.status(201).json({ message: 'Appointment booked successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to book appointment.' });
    }
};

export default {
    getAvailableTimeSlots,
    bookAppointment
}