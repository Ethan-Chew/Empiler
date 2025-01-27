import { Context, InlineKeyboard } from "grammy";
import axios, { AxiosError } from "axios";
import bot, { MyContext } from "../bot";

function escapeMarkdown(text: String) {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

const upcomingController = async (ctx: MyContext) => {
    try {
        // Check if the user has linked their account
        const checkAccountLinked = await axios.get(`http://localhost:8080/api/telegram/verify/tele/${ctx.from?.id}`);
        if (checkAccountLinked.status !== 200) {
            await ctx.reply("You need to link your account before you can view upcoming appointments.");
            return;
        }

        // Save the Telegram User's OCBC User Id to the Session
        ctx.session.userId = checkAccountLinked.data.data.userId;

        // Retrieve the user's appointment details
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
        let i = 0;
        for (const appointment of appointments) {
            i++;
            const reminders = []
            for (const reminder of appointment.reminder) {
                reminders.push(`\\- Reminder ${reminder.type} before over _${reminder.area}_ \\(${new Date(reminder.reminderTime).toLocaleString("en-SG")}\\)`);
            }
            const reminderType = reminders.join("\n");
            formattedAppointments.push(`*Appointment ${i}*\nDate: ${escapeMarkdown(appointment.date)}\nTime: ${escapeMarkdown(appointment.timeslot.timeslot)}\nLocation: ${appointment.branchName}\n${reminderType}\n`);
        }
        formattedAppointments.join("\n\n");
        const response = await ctx.reply(
            `Here's a quick look at your upcoming appointments\\! Let me know if you need help managing them\\-just tap on "Manage Appointments" and I'll be here to assist\\.\n\n${formattedAppointments}\nLet me know if there's anything else I can help you with\\!`,
             { parse_mode: "MarkdownV2", reply_markup: inlineKeyboard }
        );

        ctx.session.lastManageApptMsg = response.message_id;
    } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 404) {
                    await ctx.reply("You have no upcoming appointments.");
                    return;
                }
                if (error.response?.data.message) {
                    await ctx.reply(`Error: ${error.response.data.message}`);
                    return;
                }
            }
            await ctx.reply("An error occurred while retrieving your upcoming appointments.");
        }
}

export { upcomingController };