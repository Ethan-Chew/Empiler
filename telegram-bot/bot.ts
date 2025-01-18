import { Bot, GrammyError, HttpError } from "grammy";
import { generateUpdateMiddleware } from "telegraf-middleware-console-time";
import dotenv from "dotenv";

dotenv.config();

// Controllers
import { startController } from "./controllers/startController";
import { linkController } from "./controllers/linkController";
import { helpController } from "./controllers/helpController";
import { upcomingController } from "./controllers/upcomingController";

const token = process.env.TELEGRAM_API_KEY || "";
const bot = new Bot(token);
if (process.env.ENVIRONMENT === "development") {
    bot.use(generateUpdateMiddleware());
}

// // Handle Telegram Bot Local Session
// interface SessionData {
//   pizzaCount: number;
// }

// // Flavor the context type to include sessions.
// type MyContext = Context & SessionFlavor<SessionData>;

// const bot = new Bot<MyContext>("");

// // Install session middleware, and define the initial session value.
// function initial(): SessionData {
//   return { pizzaCount: 0 };
// }

// Command Handling
bot.command("start", startController)
bot.command("link", linkController);
bot.command("help", helpController);
bot.command("upcoming", upcomingController);

// Handle Inline Keyboard Clicks
bot.callbackQuery("manage-appointments", async (ctx) => {
  // Retrieve the 
  await ctx.answerCallbackQuery({
    text: "You were curious, indeed!",
  });
});

// Catch any errors
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
});

// Start the Bot
console.log("Telegram Bot Started");
bot.start();

export default bot;