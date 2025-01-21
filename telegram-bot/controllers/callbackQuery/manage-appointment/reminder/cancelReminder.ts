import { MyContext } from "../../../../bot";
import { InlineKeyboard } from "grammy";
import axios from "axios";

const cqCancelReminder = async (ctx: MyContext, reminderInfo: string) => {
    if (ctx.session.selectedAppt === null || ctx.session.lastManageApptMsg === null) {
        return;
    }

    // Check if the user has any appointment to cancel
    const [ type, area ] = reminderInfo.split("-");
    const appointment = await axios.delete(`http://localhost:8080/api/appointments/reminder/${ctx.session.selectedAppt}`, {
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            type: type,
            area: area,
        }
    });
    if (appointment.status !== 200) {
        await ctx.reply("An error occurred while cancelling your appointment reminder.");
        return;
    }
    
    await ctx.api.editMessageText(ctx.chat!.id, ctx.session.lastManageApptMsg, "Reminder cancelled successfully! Start a command to manage your appointments again.");
}

export { cqCancelReminder };