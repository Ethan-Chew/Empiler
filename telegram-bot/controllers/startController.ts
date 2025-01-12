import { Context } from "grammy";

const startController = async (ctx: Context) => {
    await ctx.reply(`
        # OCBC Support Bot
        Hi, I am the 'official' Support Bot for OCBC, here to help you with your queries.
        ## Commands
        - \`/start\` - Start the bot
        - \`/help\` - Get help
        - \`/link\` - Relink the bot to your OCBC Account
    `, { parse_mode: "Markdown" });
    const payload = ctx.match;
    if (payload) {
        ctx.chat
    }
}

export { startController };