import { InlineKeyboard } from "grammy";
import axios from "axios";
import { MyContext } from "../../bot";

const cqManageAppointments = async (ctx: MyContext) => {
    if (!ctx.session.lastManageApptMsg) {
        return;
    }

    // Retrieve the Appointments for the user
    const upcomingAppointment = await axios.get(`http://localhost:8080/api/telegram/appointments/upcoming/${ctx.from?.id}`);
    if (upcomingAppointment.status !== 200) {
        await ctx.reply("An error occurred while fetching your upcoming appointments.");
        return;
    }

    const appointments = await upcomingAppointment.data.data;
    if (appointments.length === 0) {
        await ctx.reply("You have no upcoming appointments.");
        return;
    }

    const appointmentDateTime = [];
    for (let appointment of appointments) {
        const text = `${appointment.date} ${appointment.timeslot.timeslot.split("-")[0]}`;
        appointmentDateTime.push([text, `manage-appt-${appointment.id}:${appointment.branchName}`]);
    }
    
    // Create Inline Keyboard for User to Choose Appointment
    const buttonRow = appointmentDateTime.map(([label, data]) => InlineKeyboard.text(label, data));
    const inlineKeyboard = InlineKeyboard.from([buttonRow]);

    // Edit the Original Message to include the new inlineKeyboard
    await ctx.api.editMessageReplyMarkup(ctx.chat!.id, ctx.session.lastManageApptMsg, { reply_markup: inlineKeyboard });
}

export { cqManageAppointments };