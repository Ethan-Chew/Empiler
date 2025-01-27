import { InlineKeyboard } from "grammy";
import { MyContext } from "../../../../bot";
import axios from "axios";

function escapeMarkdown(text: String) {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

// Retrieve the available dates for this location
const cqConfirmRescheduleAppointment = async (ctx: MyContext, date: string, timeslotId: number) => {
    try {
        if (ctx.session.selectedAppt === null || ctx.session.lastManageApptMsg === null) {
            return;
        }

        // Retrieve the Appointment
        const appointmentRequest = await axios.get(`http://localhost:8080/api/appointments/viewbooking/${ctx.session.selectedAppt}`);
        const appointment = await appointmentRequest.data;

        // Update the Appointment with the new Date and Timeslot
        await axios.put(`http://localhost:8080/api/appointments/update`, {
            id: ctx.session.selectedAppt,
            newDate: date,
            newTimeslotId: timeslotId,
            newBranchName: appointment.branchName
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Check if the Appointment was successfully updated
        const updatedAppointmentRequest = await axios.get(`http://localhost:8080/api/appointments/viewbooking/${ctx.session.selectedAppt}`);
        const updatedAppointment = await updatedAppointmentRequest.data;

        await ctx.api.editMessageText(ctx.chat!.id, ctx.session.lastManageApptMsg, `Your appointment has been successfully rescheduled\\!\n*Updated Appointment*\nDate: ${escapeMarkdown(updatedAppointment.date)}\nTime: ${escapeMarkdown(updatedAppointment.appointment_timeslots.timeslot)}\nLocation: ${updatedAppointment.branchName}\n\nIf you need any further assistance, please use the _/upcoming_ command again\\!`, { parse_mode: "MarkdownV2" });
    } catch (error) {
        console.error(error);
        await ctx.reply("Failed to retrieve available timeslots. Please try again!")
    }
}

export { cqConfirmRescheduleAppointment };