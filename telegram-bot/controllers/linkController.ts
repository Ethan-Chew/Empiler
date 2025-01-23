import { Context } from "grammy";
import axios, { AxiosError } from "axios";
import validateUUID from "../utils/validateUUID";

const linkController = async (ctx: Context) => {
    try {
        // Verify that a UUID Payload is attached
        const payload = ctx.match;
        if (!payload) {
            await ctx.reply("You need to provide a verification code to link your account.");
            return;
        }

        if (!validateUUID(payload as string)) {
            await ctx.reply("Invalid Verification Code.");
            return;
        }
        
        // Send a Validation Request
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

export { linkController };