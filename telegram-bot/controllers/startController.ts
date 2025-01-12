import { Context } from "grammy";
import axios, { AxiosError } from "axios";

const startController = async (ctx: Context) => {
    await ctx.reply(`__*OCBC Support Bot*__\nHi, I am the 'official' Support Bot for OCBC, here to help you with your queries.\n*Commands*\n- \`/start\` - Start the bot\n- \`/help\` - Get help\n- \`/link\` - Relink the bot to your OCBC Account`, { 
        parse_mode: "Markdown",
        reply_parameters: { message_id: ctx.msg!.message_id },
    });

    const payload = ctx.match;
    if (payload) {
        await ctx.reply("Verifying your account...");
        try {
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
            } else {
                await ctx.reply(response.data.message);
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
}

export { startController };