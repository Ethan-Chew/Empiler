import { MyContext } from "../../../../bot";
import { InlineKeyboard } from "grammy";
import axios from "axios";

const cqManageReminder = async (ctx: MyContext) => {
    if (ctx.session.selectedAppt === null || ctx.session.lastManageApptMsg === null) {
        return;
    }

    // Create Inline Keyboard for User to Choose Reminder
    const manageReminderKVP = [
        ["Create Reminder", "create-appt-reminder"],
    ]

    // Check if the user has any appointment to cancel
    const appointment = await axios.get(`http://localhost:8080/api/appointments/viewbooking/${ctx.session.selectedAppt}`);
    if (appointment.status !== 200) {
        await ctx.reply("An error occurred while fetching your appointment details.");
        return;
    }
    const appointmentData = await appointment.data;
    if (appointmentData.reminders.length > 0) {
        manageReminderKVP.push(["Cancel Reminder", "cancel-appt-reminder"]);
    }

    const reminderTimeButtons = manageReminderKVP.map(([label, data]) => InlineKeyboard.text(label, data));
    const inlineKeyboard = InlineKeyboard.from([reminderTimeButtons]).row().text("<< Back", "back-to-manage-appt-optns");

    // // Edit the Original Message to include the new inlineKeyboard
    await ctx.api.editMessageReplyMarkup(ctx.chat!.id, ctx.session.lastManageApptMsg, { reply_markup: inlineKeyboard });
}

export { cqManageReminder };