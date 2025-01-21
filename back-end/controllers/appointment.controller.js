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
    const { userId, date, timeSlotId, branchName } = req.body;

    try {
        const appointment = await Appointment.createAppointment(userId, date, timeSlotId, branchName);
        
        if (appointment.error) {
            return res.status(400).json({ error: appointment.error });
        }
        
        res.status(201).json(appointment.data);
    } catch (error) {
        console.error("Error in bookAppointment:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAppointment = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const appointments = await Appointment.getAppointment(appointmentId);

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ error: "No appointment found" });
        }

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error in getAppointment:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllAppointments = async (req, res) => {
    const { userId } = req.body;

    try {
        const appointments = await Appointment.getAllAppointments(userId);

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
    const { id, date, timeslotId, branchName, newDate, newTimeslotId, newBranchName } = req.body;

    try {
        const appointment = await Appointment.updateAppointments(id, date, timeslotId, branchName, newDate, newTimeslotId, newBranchName);

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
    const { appointmentId } = req.body;

    try {
        const appointment = await Appointment.deleteAppointment(appointmentId);

        if (appointment.error) {
            return res.status(400).json({ error: appointment.error });
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.error("Error in deleteAppointment:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAppointmentReminderTypes = async (req, res) => {
    try {
        const types = await Appointment.getReminderTypes();

        if (types.error) {
            return res.status(404).json({ error: types.error });
        }

        res.status(200).json(types);
    } catch (error) {
        console.error("Error in getting reminder types:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAppointmentReminders = async (req, res) => {
    try {
        const { id } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const reminders = await Appointment.getAppointmentReminder(id);

        if (reminders.error) {
            return res.status(404).json({ error: reminders.error });
        }

        res.status(200).json(reminders);
    } catch (error) {
        console.error("Error in getting reminders:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const setAppointmentReminder = async (req, res) => {
    const { appointmentId, reminderType, area } = req.body;
    if (!appointmentId || !reminderType || !area) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const dbReminderType = await Appointment.getReminderType(reminderType);
        const appointment = await Appointment.getAppointment(appointmentId);
        
        // Convert Appointment Start Date to UNIX time
        const appointmentDateTime = `${appointment.date}T${appointment.appointment_timeslots.timeslot.split("-")[0]}:00`;
        const reminderTime = (new Date(appointmentDateTime).getTime()) - (dbReminderType.hours * 3600000);

        const setReminder = await Appointment.setAppointmentReminder(appointmentId, reminderType, reminderTime, area);

        res.status(200).json({ message: 'Reminder set successfully', reminder: setReminder });
    } catch (error) {
        console.error("Error in setting a reminder for appointment:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateAppointmentReminder = async (req, res) => {
    const { appointmentId, reminderType, area } = req.body;
    if (!appointmentId || !reminderType || !area) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const dbReminderType = await Appointment.getReminderType(reminderType);
        const appointment = await Appointment.getAppointment(appointmentId);
        
        // Convert Appointment Start Date to UNIX time
        const appointmentDateTime = `${appointment.date}T${appointment.appointment_timeslots.timeslot.split("-")[0]}:00`;
        const reminderTime = (new Date(appointmentDateTime).getTime()) - (dbReminderType.hours * 3600000);

        const setReminder = await Appointment.updateAppointmentReminder(appointmentId, reminderType, reminderTime, area);

        if (setReminder.error) {
            return res.status(500).json({ error: setReminder.error });
        }

        res.status(200).json({ message: 'Reminder set successfully', reminder: setReminder });
    } catch (error) {
        console.error("Error in setting a reminder for appointment:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteAppointmentReminders = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const reminders = await Appointment.deleteAppointmentReminders(id);

        if (reminders.error) {
            return res.status(404).json({ error: reminders.error });
        }

        res.status(200).json({ status: "success" });
    } catch (error) {
        console.error("Error in getting reminders:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteAppointmentReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, area } = req.body;

        if (!type | !area) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const reminders = await Appointment.deleteAppointmentReminder(id, type, area);

        res.status(200).json({ status: "success" });
    } catch (error) {
        console.error("Error in getting reminders:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getOpeningHours = async (req, res) => {
    try {
        const { openingHours } = req.query; // Adjust to req.body or req.params if needed

        if (!openingHours) {
            return res.status(400).json({ error: 'openingHours parameter is required' });
        }

        const openingHoursData = await Appointment.getOpeningHours(openingHours);

        res.status(200).json({ openingHours: openingHoursData });
    } catch (error) {
        console.error("Error in getting opening hours:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default {
    filterAppointments,
    bookAppointment,
    getAllAppointments,
    getAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentReminderTypes,
    getAppointmentReminders,
    setAppointmentReminder,
    deleteAppointmentReminder,
    updateAppointmentReminder,
    deleteAppointmentReminders,
    getOpeningHours
};