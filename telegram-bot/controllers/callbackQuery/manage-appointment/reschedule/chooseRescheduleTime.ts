import { InlineKeyboard } from "grammy";
import { MyContext } from "../../../../bot";
import axios from "axios";
import { cqRescheduleAppointment } from "./rescheduleAppointment";

// Retrieve the available dates for this location
const cqChooseRescheduleTime = async (ctx: MyContext, date: string) => {
    try {
        if (ctx.session.selectedAppt === null || ctx.session.lastManageApptMsg === null || ctx.session.selectedBranch === null) {
            return;
        }

        // // Retrieve the Appointment
        // const appointmentRequest = await axios.get(`http://localhost:8080/api/appointments/viewbooking/${ctx.session.selectedAppt}`);
        // const appointment = await appointmentRequest.data;

        // // Retrieve the Branch Details from the Appointment
        // const branchDetailsRequest = await axios.get(`http://localhost:8080/api/branch?landmark=${appointment.branchName}`);
        // const branchDetails = await branchDetailsRequest.data.branch;
        
        // Retrieve the available timeslots for the selected date
        const availableTimeslotsRequest = await axios.post(`http://localhost:8080/api/appointments/filteredTimeslots`, {
            date: date,
            branchName: ctx.session.selectedBranch,
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        const availableTimeslots = await availableTimeslotsRequest.data.timeslots;
        if (availableTimeslots.length === 0) {
            await ctx.reply("There are no available timeslots for this date. Please choose another date.");
            cqRescheduleAppointment(ctx);
            return;
        }

        // Create an Inline Keyboard for the available timeslots
        const inlineKeyboard = new InlineKeyboard();
        for (let i = 0; i < availableTimeslots.length; i++) {
            inlineKeyboard.text(
                availableTimeslots[i].timeslot,
                `reschedule-appt-datetime-${date}-${availableTimeslots[i].id}`
            );
            if ((i + 1) % 3 === 0) {
                inlineKeyboard.row();
            }
        }
        inlineKeyboard.row().text("<< Back", "back-to-reschedule-appt");

        await ctx.api.editMessageReplyMarkup(ctx.chat!.id, ctx.session.lastManageApptMsg, { reply_markup: inlineKeyboard });
    } catch (error) {
        await ctx.reply("Failed to retrieve available timeslots. Please try again!")
    }
}

export { cqChooseRescheduleTime };