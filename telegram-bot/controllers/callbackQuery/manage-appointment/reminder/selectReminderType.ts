import { InlineKeyboard } from "grammy";
import { MyContext } from "../../../../bot";

const cqSelectReminderType = async (ctx: MyContext) => {
    if (ctx.session.selectedAppt === null || ctx.session.lastManageApptMsg === null) {
        return;
    }

    // Create Inline Keyboard for User to Choose Reminder Type
    const inlineKeyboard = new InlineKeyboard()
        .text("Telegram", "reminder-area-telegram")
        .text("Email", "reminder-area-email")
        .row()
        .text("<< Back", "back-to-reminder-time");

    await ctx.api.editMessageReplyMarkup(ctx.chat!.id, ctx.session.lastManageApptMsg, { reply_markup: inlineKeyboard });
}

export { cqSelectReminderType };