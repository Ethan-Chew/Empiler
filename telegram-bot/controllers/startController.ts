import { Context } from "grammy";
import axios, { AxiosError } from "axios";
import validateUUID from "../utils/validateUUID";
import bot from "../bot";

const startController = async (ctx: Context) => {
    const welcomeMessage = `__*OCBC Support Bot*__\n` +
    `Hi, I am the 'official' Support Bot for OCBC, here to help you with your queries\.\n\n` +
    `*Commands*\n` +
    `- \`/start\` - Start the bot\.\n` +
    `- \`/link\` - Link the bot to your OCBC Account\.\n` +
    `- \`/unlink\` - Unlink the bot from your OCBC Account (you will not be able to access services until you re-link it\.)\n` +
    `- \`/upcoming\` - View all Upcoming Appointments\.\n\n` +
    `If you're trying to connect your account, you need to provide a verification code\.\n` +
    `Run the command in the format of \`/start verification_code\`\.`;
    await ctx.reply(welcomeMessage, { 
        parse_mode: "Markdown",
        reply_parameters: { message_id: ctx.msg!.message_id },
    });

    const payload = ctx.match;
    if (payload) {
        await ctx.reply("Verifying your account...");
        try {
            if (!validateUUID(payload as string)) {
                await ctx.reply("Invalid Verification Code.");
                return;
            }

            const response = await axios.put(`http://localhost:8080/api/telegram/link`, {
                verificationCode: payload,
                telegramId: ctx.from?.id,
                telegramUsername: ctx.from?.username,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.status === 200) {
                await ctx.reply("Successfully linked your account to the bot.");

                // Remove the options to Start and Link the Bot
                await bot.api.setMyCommands([
                    { command: "unlink", description: "Unlink the bot from your OCBC Account (you will not be able to access services until you re-link it.)" },
                    { command: "upcoming", description: "View all Upcoming Appointments" }
                ]);
            } else {
                await ctx.reply(response.data.message);
            }
        } catch (error) {
            console.log(error)
            if (error instanceof AxiosError) {
                if (error.response?.data.message) {
                    await ctx.reply(`Error: ${error.response.data.message}`);
                    return;
                }
            }
            await ctx.reply("An error occurred while linking your account to the bot.");
        }
    }
}

export { startController };