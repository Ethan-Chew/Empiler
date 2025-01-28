import supabase from "../utils/supabase.js";
import cron from 'node-cron';

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
            console.log(appointments);

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

    static async updateAppointments(id, newDate, newTimeslotId, newBranchName) {
        try {
            // Perform the update without returning updated data
            const { count, error } = await supabase
                .from("branch_appointments")
                .update({ date: newDate, timeslotId: newTimeslotId, branchName: newBranchName })
                .eq("id", id);
    
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

    static async getAvailableTimeslotsWithinOpeningHours(date, branchName, openingHours) {
        try {
            // Step 1: Get the available timeslots
            const availableTimeslots = await this.getAvailableTimeslots(date, branchName);
    
            if (availableTimeslots.error) {
                return availableTimeslots; // Return error if no data found
            }
    
            // Step 2: Get the opening hours for the day
            const openingHoursToday = await this.getOpeningHours(openingHours);
    
            if (openingHoursToday === "Closed") {
                return []; // If the branch is closed, no timeslots are available
            }
    
            if (openingHoursToday.start && openingHoursToday.end) {
                const { start, end } = openingHoursToday;
    
                // Convert times to 24-hour format for easier comparison
                const convertTo24Hour = (time) => {
                    time = time.trim().toLowerCase();
                    if (time.indexOf('.') > -1) {
                        time = time.replace('.', ':');
                    }
                
                    const match = time.match(/^(\d{1,2}):(\d{2})([ap]m)$/);
                    
                    if (match) {
                        // If the time matches the am/pm format, convert it
                        const [, hourStr, minuteStr, period] = match;
                        let hours = Number(hourStr);
                        let minutes = Number(minuteStr);
                        if (period === 'pm' && hours !== 12) {
                            hours += 12;
                        } else if (period === 'am' && hours === 12) {
                            hours = 0;
                        }
                        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                    } else {
                        // Return the time unchanged if it does not have an am/pm suffix
                        return time;
                    }
                };
    
                const openingStartMinutes = convertTo24Hour(start);
                const openingEndMinutes = convertTo24Hour(end);
    
                // Step 3: Filter timeslots based on opening hours
                const filteredTimeslots = availableTimeslots.filter((timeslot) => {
                    const timeslotRange = timeslot.timeslot.split('-');  // Split time range
                    const timeslotStart = convertTo24Hour(timeslotRange[0]);
                    const timeslotEnd = convertTo24Hour(timeslotRange[1]);
                
                    return timeslotStart >= openingStartMinutes && timeslotEnd <= openingEndMinutes;
                });
    
                return filteredTimeslots;
            } else {
                return { error: "Invalid opening hours data" };
            }
        } catch (error) {
            console.error(error);
            return { error: "Error filtering timeslots within opening hours" };
        }
    }

    static async deletePastAppointments() {
        try {
            const { data, error } = await supabase
                .from('branch_appointments')
                .delete()
                .lt('date', new Date().toISOString().split('T')[0]);

            if (error) {
                console.error(error);
                return { error: "Error deleting past appointments" };
            }

            return data;
        } catch (error) {
            console.error(error);
            return { error: "Error deleting past appointments" };
        }
    }

    
}

// Run `deletePastAppointments` once when the backend starts
(async () => {
    console.log('Running initial deletion of past appointments...');
    try {
        await Appointment.deletePastAppointments();
        console.log('Initial deletion completed.');
    } catch (error) {
        console.error('Error during initial deletion:', error);
    }
})();

// Schedule the cron job directly in this module
cron.schedule('0 0 * * *', async () => {
    console.log('Running cron job: Deleting past appointments');
    try {
        await Appointment.deletePastAppointments();
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});
console.log('Cron job scheduled to run daily at midnight.');