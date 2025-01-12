import { Context } from "grammy";
import axios from "axios";

const startController = async (ctx) => {
    await ctx.reply("AWErgothf");
    await ctx.reply(`
        # OCBC Support Bot
        Hi, I am the 'official' Support Bot for OCBC, here to help you with your queries.
        ## Commands
        - \`/start\` - Start the bot
        - \`/help\` - Get help
        - \`/link\` - Relink the bot to your OCBC Account
    `, { 
        parse_mode: "Markdown",
        reply_parameters: { message_id: ctx.msg.message_id },
    });

    const payload = ctx.match;
    if (payload) {
        console.log(ctx.chat);
    }
}

export { startController };