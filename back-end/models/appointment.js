import supabase from "../utils/supabase.js";

export default class Appointment {
    constructor(name, date, timeslotId, branchName) {
        this.name = name;
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

    static async createAppointment(name, date, timeslotId, branchName) {
        try {
            const { data, error } = await supabase
                .from("branch_appointments")
                .insert([{ name, date, timeslotId, branchName }])
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

    static async getAllAppointments(name) {
        try {
            const { data, error } = await supabase
            .from("branch_appointments")
            .select("*")
            .eq("name", name);

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

    static async updaeAppointments(name, date, timeslotId, branchName, newDate, newTimeslotId, newBranchName) {
        try {
            const { data, error } = await supabase
                .from("branch_appointments")
                .update({ date: newDate, timeslotId: newTimeslotId, branchName: newBranchName })
                .eq("name", name)
                .eq("date", date)
                .eq("timeslotId", timeslotId)
                .eq("branchName", branchName)
                .single();

            if (error) {
                console.error(error);
                return { error: "Error updating appointment" };
            }

            return data;
        } catch (error) {
            console.error(error);
            return { error: "Error updating appointment" };
        }
    }

    static async deleteAppointment(name, date, timeslotId, branchName) {
        try {
            const { data, error } = await supabase
                .from("branch_appointments")
                .delete()
                .eq("name", name)
                .eq("date", date)
                .eq("timeslotId", timeslotId)
                .eq("branchName", branchName)
                .single();
                
            if (error) {
                console.error(error);
                return { error: "Error deleting appointment" };
            }

            return data;
        } catch (error) {
            console.error(error);
            return { error: "Error deleting appointment" };
        }
    }
}