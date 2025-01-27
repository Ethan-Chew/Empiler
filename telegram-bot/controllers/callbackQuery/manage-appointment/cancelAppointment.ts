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

    await ctx.api.editMessageText(ctx.chat!.id, ctx.session.lastManageApptMsg, "Your Appointment has been successfully cancelled.");
}

export { cqCancelAppointment };