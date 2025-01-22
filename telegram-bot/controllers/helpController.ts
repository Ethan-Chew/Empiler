import { Context } from "grammy";
import bot from "../bot";

const helpController = async (ctx: Context) => {
    console.log(ctx.from)
}

export { helpController };