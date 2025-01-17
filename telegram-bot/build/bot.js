"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const telegraf_middleware_console_time_1 = require("telegraf-middleware-console-time");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Controllers
const startController_1 = require("./controllers/startController");
const linkController_1 = require("./controllers/linkController");
const helpController_1 = require("./controllers/helpController");
const upcomingController_1 = require("./controllers/upcomingController");
const token = process.env.TELEGRAM_API_KEY || "";
const bot = new grammy_1.Bot(token);
if (process.env.ENVIRONMENT === "development") {
    bot.use((0, telegraf_middleware_console_time_1.generateUpdateMiddleware)());
}
// Command Handling
bot.command("start", startController_1.startController);
bot.command("link", linkController_1.linkController);
bot.command("help", helpController_1.helpController);
bot.command("upcoming", upcomingController_1.upcomingController);
// Catch any errors
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof grammy_1.GrammyError) {
        console.error("Error in request:", e.description);
    }
    else if (e instanceof grammy_1.HttpError) {
        console.error("Could not contact Telegram:", e);
    }
    else {
        console.error("Unknown error:", e);
    }
});
// Start the Bot
console.log("Telegram Bot Started");
bot.start();
exports.default = bot;
