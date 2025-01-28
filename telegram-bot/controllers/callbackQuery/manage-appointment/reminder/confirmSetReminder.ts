import { InlineKeyboard } from "grammy";
import { MyContext } from "../../../../bot";
import axios from "axios";

const cqConfirmSetReminder = async (ctx: MyContext, area: string) => {
    if (ctx.session.selectedAppt === null || ctx.session.lastManageApptMsg === null) {
        return;
    }

    // Send a request to the server to set reminder
    const setReminderRequest = await axios.post("http://localhost:8080/api/appointments/reminders", {
        appointmentId: ctx.session.selectedAppt,
        reminderType: ctx.session.selectedReminderType,
        area: area
    });

    if (setReminderRequest.status !== 200) {
        await ctx.api.editMessageText(ctx.chat!.id, ctx.session.lastManageApptMsg, "Oh no! We've failed to add a reminder to your appointment. Please try again later.");
        return;
    }

    await ctx.api.editMessageText(ctx.chat!.id, ctx.session.lastManageApptMsg, "Reminder added successfully!");
    return;
}

export { cqConfirmSetReminder };