import axios from "axios";
import { MyContext } from "../../../../bot";
import { InlineKeyboard } from "grammy";

const cqManageReminderTime = async (ctx: MyContext) => {
    if (ctx.session.selectedAppt === null || ctx.session.lastManageApptMsg === null) {
        return;
    }

    const appointmentReminderTypeReq = await axios.get("http://localhost:8080/api/appointments/remindertypes");
    if (appointmentReminderTypeReq.status !== 200) {
        await ctx.reply("An error occurred while fetching the reminder types.");
        return;
    }
    
    const appointmentReminderTypes = await appointmentReminderTypeReq.data;
    // Update Original Message to include Inline Keyboard to Choose Reminder Time
    const reminderTimeKVP = [];
    for (const reminderType of appointmentReminderTypes) {
        reminderTimeKVP.push([
            reminderType.type,
            `appt-reminder-type-${reminderType.type}`
        ])
    }
    const reminderTimeButtons = reminderTimeKVP.map(([label, data]) => InlineKeyboard.text(label, data));
    const inlineKeyboard = InlineKeyboard.from([reminderTimeButtons]).row().text("<< Back", "back-to-manage-appt-optns");

    await ctx.api.editMessageReplyMarkup(ctx.chat!.id, ctx.session.lastManageApptMsg, { reply_markup: inlineKeyboard });
}

export { cqManageReminderTime };