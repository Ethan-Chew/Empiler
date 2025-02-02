import { Context } from "grammy";
import axios from "axios";
import bot from "../bot";

const unlinkController = async (ctx: Context) => {
    try {
        const telegramId = ctx.from?.id;
        
        const verifyAccountLinkedReq = await axios.get(`http://localhost:8080/api/telegram/verify/tele/${telegramId}`);
        if (verifyAccountLinkedReq.status !== 200) {
            await ctx.reply("You have not linked your account yet.");
            return;
        }

        const userId = verifyAccountLinkedReq.data.data.userId;
        const unlinkRequest = await axios.get(`http://localhost:8080/api/telegram/unlink/${userId}`);
        if (unlinkRequest.status === 200) {
            await ctx.reply("Successfully unlinked your account.\nIf you wish to link your account again, please use the OCBC Support Portal to generate a 'Linking' Code before continuing.");
        } else {
            throw new Error(unlinkRequest.data.message);
        }

        await bot.api.setMyCommands([
            { command: "start", description: "Start the bot" },
            { command: "link", description: "Link the bot to your OCBC Account" },
        ]);          
    } catch (error) {
        console.log(error);
        await ctx.reply("Failed to unlink your account, please try again later!");
    }
}

export { unlinkController };