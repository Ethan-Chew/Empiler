import { Bot, Context, GrammyError, HttpError, session, SessionFlavor } from "grammy";
import { generateUpdateMiddleware } from "telegraf-middleware-console-time";
import dotenv from "dotenv";

dotenv.config();

// Controllers
import { startController } from "./controllers/startController";
import { linkController } from "./controllers/linkController";
import { helpController } from "./controllers/helpController";
import { upcomingController } from "./controllers/upcomingController";
/// Context Query Controllers
import { cqManageAppointments } from "./controllers/callbackQuery/manageAppointments";
import { cqManageAppointmentSelection } from "./controllers/callbackQuery/manage-appointment/manageAppointmentSelection";
import { cqRescheduleAppointment } from "./controllers/callbackQuery/manage-appointment/rescheduleAppointment";
import { cqCancelAppointment } from "./controllers/callbackQuery/manage-appointment/cancelAppointment";
import { cqManageReminder } from "./controllers/callbackQuery/manage-appointment/manageReminder";

// Handle Telegram Bot Local Session
interface SessionData {
  lastManageApptMsg: number | null;
  selectedAppt: string | null;
  userId: string | null
}

export type MyContext = Context & SessionFlavor<SessionData>;

const token = process.env.TELEGRAM_API_KEY || "";
const bot = new Bot<MyContext>(token);
if (process.env.ENVIRONMENT === "development") {
    bot.use(generateUpdateMiddleware());
}

// Return Initial Session Data
function initial(): SessionData {
  return { lastManageApptMsg: null, selectedAppt: null, userId: null };
}
bot.use(session({ initial: initial }));

// Command Handling
bot.command("start", startController)
bot.command("link", linkController);
bot.command("help", helpController);
bot.command("upcoming", upcomingController);

// Handle Inline Keyboard Clicks
/// Manage Appointments
bot.callbackQuery("manage-appointments", cqManageAppointments);
//// Manage Appointment Options (Reschedule, Cancel, Manage Reminder, Back)
bot.callbackQuery("reschedule-appt", cqRescheduleAppointment);
bot.callbackQuery("cancel-appt", cqCancelAppointment);
bot.callbackQuery("manage-reminder-appt", cqManageReminder);
bot.callbackQuery("back-to-manage-appt", cqManageAppointments);

/// Catch-All for Callback Queries
bot.on("callback_query:data", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  // Selection of Appointment (Manage Appointment)
  if (callbackData.startsWith("manage-appt-")) {
    ctx.session.selectedAppt = callbackData.replace("manage-appt-", "");
    cqManageAppointmentSelection(ctx);
  }
  // await ctx.answerCallbackQuery(); // remove loading animation
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