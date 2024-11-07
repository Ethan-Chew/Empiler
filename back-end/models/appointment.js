import supabase from '../utils/supabase.js';

// Fetch all timeslots
export const getAllTimeSlots = async () => {
    const { data, error } = await supabase.from('appointment_timeslots').select('*');
    console.log(data);
    if (error) throw error;
    return data;
};

// Check if a timeslot is available
export const isTimeSlotAvailable = async (date, timeslotId) => {
    const { data, error } = await supabase
        .from('branch_appointments')
        .select('timeslotId')
        .eq('date', date)
        .eq('timeslotId', timeslotId);
    console.log("Filtered data:", data);
    console.log("Error (if any):", error);
    if (error) throw error;
    return data.length === 0;
};


// Book an appointment
export const bookAppointment = async (name, date, timeslotId) => {
    const { error } = await supabase.from('branch_appointments').insert([{ name, date, timeslotId }]);
    if (error) throw error;
};
