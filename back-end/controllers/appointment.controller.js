import Appointment from "../models/appointment.js";

const filterAppointments = async (req, res) => {
    try {
        const { date, branchName } = req.params;

        // Call the refactored method to get available timeslots
        const availableTimeslots = await Appointment.getAvailableTimeslots(date, branchName);

        if (availableTimeslots.error) {
            return res.status(404).json({ error: availableTimeslots.error });
        }

        res.status(200).json(availableTimeslots);
    } catch (error) {
        console.error("Error in filterAppointments:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const bookAppointment = async (req, res) => {
    const { name, date, timeSlotId, branchName } = req.body;

    try {
        const appointment = await Appointment.createAppointment(name, date, timeSlotId, branchName);
        
        if (appointment.error) {
            return res.status(400).json({ error: appointment.error });
        }
        
        res.status(201).json(appointment.data);
    } catch (error) {
        console.error("Error in bookAppointment:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllAppointments = async (req, res) => {
    const { name } = req.body;

    try {
        const appointments = await Appointment.getAllAppointments(name);

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ error: "No appointments found" });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error in getAllAppointments:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateAppointment = async (req, res) => {
    const { name, date, timeslotId, branchName, newDate, newTimeslotId, newBranchName } = req.body;

    try {
        const appointment = await Appointment.updateAppointments(name, date, timeslotId, branchName, newDate, newTimeslotId, newBranchName);

        if (appointment.error) {
            return res.status(400).json({ error: appointment.error });
        }

        return res.status(200).json({ message: 'Appointment updated successfully', data: appointment.data });
    } catch (error) {
        console.error("Error in updateAppointment:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteAppointment = async (req, res) => {
    const { name, date, timeslotId, branchName } = req.body;

    try {
        const appointment = await Appointment.deleteAppointment(name, date, timeslotId, branchName);

        console.log(appointment);

        if (appointment.error) {
            return res.status(400).json({ error: appointment.error });
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.error("Error in deleteAppointment:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default {
    filterAppointments,
    bookAppointment,
    getAllAppointments,
    updateAppointment,
    deleteAppointment,
};