import { Context } from "grammy";
import bot from "../bot.js";

const linkController = async (ctx) => {
    await bot.api.sendMessage(1197301213, "this is a private message to ethan");
    await bot.api.sendMessage(320934953, "this is a private message to jeff");
    await bot.api.sendMessage(796271219, "this is a private message to hervin");
}

export { linkController };