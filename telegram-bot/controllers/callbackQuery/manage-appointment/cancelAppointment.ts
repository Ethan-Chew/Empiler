import { InlineKeyboard } from "grammy";
import { MyContext } from "../../../bot";
import axios from "axios";

const cqCancelAppointment = async (ctx: MyContext) => {
    if (ctx.session.selectedAppt === null || ctx.session.lastManageApptMsg === null|| ctx.session.userId === null) {
        return;
    }

    const cancelAppointmentRequest = await axios.delete("http://localhost:8080/api/appointments/delete", {
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            appointmentId: ctx.session.selectedAppt
        }
    })
    if (cancelAppointmentRequest.status !== 200) {
        await ctx.reply("An error occurred while cancelling the appointment.");
        return;
    }
    await ctx.reply("Appointment has been successfully cancelled.");

    // Clear the Inline Keyboard for the previous message
    await ctx.api.editMessageReplyMarkup(ctx.chat!.id, ctx.session.lastManageApptMsg, { reply_markup: new InlineKeyboard() });
}

export { cqCancelAppointment };