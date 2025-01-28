import { InlineKeyboard } from "grammy";
import { MyContext } from "../../../bot";

const cqManageAppointmentSelection = async (ctx: MyContext) => {
    if (ctx.session.selectedAppt === null || ctx.session.lastManageApptMsg === null) {
        return;
    }

    // Create Inline Keyboard for User to Choose Appointment
    const inlineKeyboard = new InlineKeyboard()
        .text("Reschedule Appointment", "reschedule-appt")
        .text("Cancel Appointment", "cancel-appt")
        .row()
        .text("Manage Reminder", "manage-reminder-appt")
        .row()
        .text("<< Back", "back-to-manage-appt");

    // // Edit the Original Message to include the new inlineKeyboard
    await ctx.api.editMessageReplyMarkup(ctx.chat!.id, ctx.session.lastManageApptMsg, { reply_markup: inlineKeyboard });
}

export { cqManageAppointmentSelection };