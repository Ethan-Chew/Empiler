import { Bot } from "grammy";
import dotenv from "dotenv";

dotenv.config();

// Controllers
import { startController } from "./controllers/startController";

const token = process.env.TELEGRAM_API_KEY || "";
const bot = new Bot(token);

// Command Handling
bot.command("start", startController)

bot.start();