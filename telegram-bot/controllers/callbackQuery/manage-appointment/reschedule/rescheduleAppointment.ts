import { InlineKeyboard } from "grammy";
import { MyContext } from "../../../../bot";

// Retrieve the available dates for this location
const cqRescheduleAppointment = async (ctx: MyContext) => {
    try {
        if (ctx.session.selectedAppt === null || ctx.session.lastManageApptMsg === null) {
            return;
        }
        
        // Create an Inline Keyboard for 5 days in the future
        const inlineKeyboard = new InlineKeyboard();
        const today = new Date();
        for (let i = 1; i <= 5; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i + (ctx.session.displayApptDateOffset * 5));
            inlineKeyboard.text(date.toDateString(), `reschedule-appt-${date.toISOString().split('T')[0]}`);
            if ((i + 1) % 2 === 0) {
                inlineKeyboard.row();
            }
        }

        // Add Options to go -5 days or +5 days, but if the first date is already today, disable the -5 days option
        if (ctx.session.displayApptDateOffset !== 0) {
            inlineKeyboard.row().text("<< -5 Days", "reschedule-appt-previous-5-days");
        }
        inlineKeyboard.text("+5 Days >>", "reschedule-appt-next-5-days");

        // Add Option to go back to manage appointment options
        inlineKeyboard.row().text("<< Back", "back-to-manage-appt");

        await ctx.api.editMessageReplyMarkup(ctx.chat!.id, ctx.session.lastManageApptMsg, { reply_markup: inlineKeyboard });
    } catch (error) {
        await ctx.reply("Failed to retrieve available timeslots. Please try again!")
    }
}

export { cqRescheduleAppointment };