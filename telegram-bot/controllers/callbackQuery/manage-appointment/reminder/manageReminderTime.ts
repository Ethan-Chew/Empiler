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
    // const reminderTimeKVP = [];
    const inlineKeyboard = new InlineKeyboard();
    for (let i = 0; i < appointmentReminderTypes.length; i++) {
        inlineKeyboard.text(
            appointmentReminderTypes[i].type,
            `appt-reminder-type-${appointmentReminderTypes[i].type}`
        );
        // Add a Row after every 3 types
        if ((i + 1) % 3 === 0) {
            inlineKeyboard.row();
        }
    }
    inlineKeyboard.row().text("<< Back", "back-to-manage-reminder-optns");

    await ctx.api.editMessageReplyMarkup(ctx.chat!.id, ctx.session.lastManageApptMsg, { reply_markup: inlineKeyboard });
}

export { cqManageReminderTime };