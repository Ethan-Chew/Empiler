import { Context } from "grammy";
import axios, { AxiosError } from "axios";
import bot from "../bot";

const upcomingController = async (ctx: Context) => {
    try {
        const checkAccountLinked = await axios.get(`http://localhost:8080/api/telegram/verify/tele/${ctx.from?.id}`);
        if (checkAccountLinked.status !== 200) {
            await ctx.reply("You need to link your account before you can view upcoming appointments.");
            return;
        }

        const accountDetails = await checkAccountLinked.data.data;
        const upcomingAppointment = await axios.get(`http://localhost:8080/api/telegram/appointments/upcoming/${accountDetails.id}`);
        if (upcomingAppointment.status !== 200) {
            await ctx.reply("An error occurred while fetching your upcoming appointments.");
            return;
        }

        const appointments = await upcomingAppointment.data.data;
        if (appointments.length === 0) {
            await ctx.reply("You have no upcoming appointments.");
            return;
        } else {
            
        }
    } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data.message) {
                    await ctx.reply(`Error: ${error.response.data.message}`);
                    return;
                }
            }
            await ctx.reply("An error occurred while linking your account to the bot.");
        }
}

export { upcomingController };