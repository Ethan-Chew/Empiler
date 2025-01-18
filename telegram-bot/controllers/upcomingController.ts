import { Context, InlineKeyboard } from "grammy";
import axios, { AxiosError } from "axios";
import bot from "../bot";

function escapeMarkdownV2(text: String) {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

const upcomingController = async (ctx: Context) => {
    try {
        // Check if the user has linked their account
        const checkAccountLinked = await axios.get(`http://localhost:8080/api/telegram/verify/tele/${ctx.from?.id}`);
        if (checkAccountLinked.status !== 200) {
            await ctx.reply("You need to link your account before you can view upcoming appointments.");
            return;
        }

        // Retrieve the user's appointment details
        const accountDetails = await checkAccountLinked.data.data;
        const upcomingAppointment = await axios.get(`http://localhost:8080/api/telegram/appointments/upcoming/${ctx.from?.id}`);
        if (upcomingAppointment.status !== 200) {
            await ctx.reply("An error occurred while fetching your upcoming appointments.");
            return;
        }

        
        const appointments = await upcomingAppointment.data.data;
        if (appointments.length === 0) {
            await ctx.reply("You have no upcoming appointments.");
            return;
        }

        // Create an Inline Keyboard for Manage Appointments
        const inlineKeyboard = new InlineKeyboard().text("Manage Appointments", "manage-appointments");

        // Display the User's upcoming appointments
        const formattedAppointments = [];
        for (let appointment of appointments) {
            formattedAppointments.push(`*Appointment*\nDate: ${escapeMarkdownV2(appointment.date)}\nTime: ${escapeMarkdownV2(appointment.timeslot.timeslot)}\nLocation: ${appointment.branchName}\n\n`);
        }
        formattedAppointments.join("\n\n");
        await ctx.reply(
            `Here are your upcoming appointments\\. If you require any further assistance, continue to interact with me by tapping on _Manage Appointments_\\.\n\n${formattedAppointments}`,
             { parse_mode: "MarkdownV2", reply_markup: inlineKeyboard }
        )       
    } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data.message) {
                    await ctx.reply(`Error: ${error.response.data.message}`);
                    return;
                }
            }
            console.error(error);
            await ctx.reply("An error occurred while retrieving your upcoming appointments.");
        }
}

export { upcomingController };