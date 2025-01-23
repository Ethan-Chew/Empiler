import supabase from "../utils/supabase.js";

export default class Appointment {
    constructor(id, userId, date, timeslotId, branchName) {
        this.id = id;
        this.userId = userId;
        this.date = date;
        this.timeslotId = timeslotId;
        this.branchName = branchName;
    }

    static async getTimeslots() {
        const { data, error } = await supabase
            .from("appointment_timeslots")
            .select("*")

        if (error) {
            console.error(error);
            return null;
        }

        return data;
    }

    static async getExistingAppointments(date, branchName) {
        const { data, error } = await supabase
            .from("branch_appointments")
            .select("*")
            .eq("date", date)
            .eq("branchName", branchName);

        if (error) {
            console.error(error);
            return null;
        }

        return data;
    }

    static async getAvailableTimeslots(date, branchName) {
        try {
            const timeslots = await Appointment.getTimeslots();
            const appointments = await Appointment.getExistingAppointments(date, branchName);

            if (!timeslots || !appointments) {
                return { error: "No data found for the provided date or branch" };
            }

            // Filter out timeslots that are already booked
            const availableTimeslots = timeslots.filter((timeslot) => {
                const isBooked = appointments.some((appointment) => appointment.timeslotId === timeslot.id);
                return !isBooked;
            });

            return availableTimeslots;
        } catch (error) {
            console.error(error);
            return { error: "Error retrieving available timeslots" };
        }
    }

    static async createAppointment(userId, date, timeslotId, branchName) {
        try {
            const { data, error } = await supabase
                .from("branch_appointments")
                .insert([{ userId, date, timeslotId, branchName }])
                .single();
                
            if (error) {
                console.error(error);
                return { error: "Error creating appointment" };
            }

            return {data};
        } catch (error) {
            console.error(error);
            return { error: "Error creating appointment" };
        }
    }
    
    static async getAppointment(appointmentId) {
        try {
            const { data, error } = await supabase
                .from("branch_appointments")
                .select(`*, appointment_timeslots(timeslot), reminders:appointment_reminder!appointmentId (reminderId, type, reminderTime, area)`)
                .eq("id", appointmentId)
                .single();
            if (error) {
                console.error(error);
                return null;
            }

            return data;
        } catch (error) {
            console.error(error);
            return { error: "Error getting appointment" };
        }
    }

    static async getAllAppointments(userId) {
        try {
            const { data, error } = await supabase
            .from("branch_appointments")
            .select("*")
            .eq("userId", userId);

            if (error) {
                console.error(error);
                return null;
            }

            // Find the timeslot time
            const timeslot = await Appointment.getTimeslots();

            data.forEach((appointment) => {
                const timeslotData = timeslot.find((timeslot) => timeslot.id === appointment.timeslotId);
                appointment.time = timeslotData.timeslot;
            });

            return data;
        } catch (error) {
            console.error(error);
            return { error: "Error getting appointments" };
        }
    }

    static async updateAppointments(id, date, timeslotId, branchName, newDate, newTimeslotId, newBranchName) {
        try {
            // Perform the update without returning updated data
            const { count, error } = await supabase
                .from("branch_appointments")
                .update({ date: newDate, timeslotId: newTimeslotId, branchName: newBranchName })
                .match({ id, date, timeslotId, branchName });
    
            // Check if there was an error
            if (error) {
                console.error(error);
                return { error: "Error updating appointment" };
            }
    
            // If no rows were updated, return an error
            if (count === 0) {
                return { error: "No matching record found to update" };
            }
    
            // Return success if the update was successful
            return { success: true };
    
        } catch (error) {
            console.error(error);
            return { error: "Error updating appointment" };
        }
    }

    static async deleteAppointment(appointmentId) {
        try {
            const { count, error } = await supabase
                .from("branch_appointments")
                .delete()
                .eq("id", appointmentId)
                .single();
                
            if (error) {
                console.error(error);
                return { error: "Error deleting appointment" };
            }
            // If no rows were updated, return an error
            if (count === 0) {
                return { error: "No matching record found to update" };
            }

            // Return success if the update was successful
            return { success: true };
        } catch (error) {
            console.error(error);
            return { error: "Error deleting appointment" };
        }
    }

    static async getReminderType(type) {
        try {
            const { data, error } = await supabase
                .from("appointment_reminder_type")
                .select("*")
                .eq("type", type)
                .single();
            
            if (error) {
                console.error(error);
                throw new Error(error.message);
            }

            return data;
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    static async getReminderTypes() {
        try {
            const { data, error } = await supabase
                .from("appointment_reminder_type")
                .select("*");

            if (error) {
                console.error(error);
                throw new Error(error.message);
            }

            return data;
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    static async getAllAppointmentReminders({ type }) {

        try {
            let query = supabase
                .from('branch_appointments')
                .select(`
                    *,
                    timeslot:appointment_timeslots!id (
                        timeslot
                    ),
                    user:user!id (
                        id,
                        email,
                        name,
                        telegram:telegram_verification!id (
                            telegramId
                        )
                    ),
                    reminders:appointment_reminder!appointmentId (
                        reminderId,
                        type:appointment_reminder_type!type (
                            hours
                        ),
                        reminderTime,
                        area
                    )
                `);

            // Apply filter for `type` if provided
            if (type) {
                query = query.eq('type', type);
            }

            const { data, error } = await query;

            if (error) {
                console.error(error);
                return { error: "Error retrieving reminders" };
            }

            // Filter out appointments that don't have reminders
            const filteredData = data.filter((appt) => appt.reminders.length > 0);

            return filteredData;
        } catch (error) {
            console.error(error);
            return { error: "Error retrieving reminders" };
        }
    }

    static async setAppointmentReminder(appointmentId, type, reminderTime, area) {
        try {
            const { data, error } = await supabase
                .from("appointment_reminder")
                .insert([{ appointmentId, type, reminderTime, area }])
                .single();

            if (error) {
                console.error(error);
                return { error: "Error setting reminder" };
            }

            return data;
        } catch (error) {
            console.error(error);
            return { error: "Error setting reminder" };
        }
    }

    static async updateAppointmentReminder(appointmentId, type, reminderTime, area) {
        try {
            const { data, error } = await supabase
                .from("appointment_reminder")
                .update({ type, reminderTime, area })
                .eq("appointmentId", appointmentId)
                .single();

            if (error) {
                console.error(error);
                return { error: "Error updating reminder" };
            }

            return data;
        } catch (error) {
            console.error(error);
            return { error: "Error updating reminder" };
        }
    }

    static async getAppointmentReminders(userId) {
        try {
            const { data, error } = await supabase
                .from('branch_appointments')
                .select(`
                    id,
                    date,
                    timeslotId,
                    branchName,
                    appointment_reminder (
                        type
                    )
                `)
                .eq('userId', userId);
            
            if (error) {
                console.error(error);
                return { error: "Error retrieving reminders" };
            }

            return data;
        } catch (error) {
            console.error(error);
            return { error: "Error retrieving reminders" };
        }
    }

    static async deleteAppointmentReminders(reminderIds) {
        try {
            // If it's a single ID, convert it into an array for consistency
            const idsToDelete = Array.isArray(reminderIds) ? reminderIds : [reminderIds];

            const { data, error } = await supabase
                .from('appointment_reminder')
                .delete()
                .in('reminderId', idsToDelete);
            
            if (error) {
                console.error(error);
                return { error: "Error deleting reminders" };
            }

            return data;
        } catch (error) {
            console.error(error);
            return { error: "Error deleting reminders" };
        }
    }

    static async getOpeningHours(openingHours) {
        try {
            const today = new Date();
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const todayName = dayNames[today.getDay()];

            // Updated regex to handle specific days and ranges of times (mon-fri, etc.)
            const regex = new RegExp(`(?:${todayName}|${dayNames.join('|')})(?:\\s*-\\s*${dayNames.join('|')})?:\\s*(\\d{1,2}\\.\\d{2}[ap]m)\\s*[-to]{1,2}\\s*(\\d{1,2}\\.\\d{2}[ap]m)`, 'i');
            const match = openingHours.match(regex);

            if (match) {
                const [, start, end] = match;
                return {start, end};
            } else {
                return "Closed";
            }
        } catch (error) {
            console.error(error);
            return "Error getting opening hours";
        }
    }
    
}
