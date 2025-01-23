import { Bot, Context, GrammyError, HttpError, session, SessionFlavor } from "grammy";
import { generateUpdateMiddleware } from "telegraf-middleware-console-time";
import dotenv from "dotenv";

dotenv.config();

// Controllers
import { startController } from "./controllers/startController";
import { linkController } from "./controllers/linkController";
import { unlinkController } from "./controllers/unlinkController";
import { upcomingController } from "./controllers/upcomingController";
/// Context Query Controllers
import { cqManageAppointments } from "./controllers/callbackQuery/manageAppointments";
import { cqManageAppointmentSelection } from "./controllers/callbackQuery/manage-appointment/manageAppointmentSelection";
import { cqRescheduleAppointment } from "./controllers/callbackQuery/manage-appointment/rescheduleAppointment";
import { cqCancelAppointment } from "./controllers/callbackQuery/manage-appointment/cancelAppointment";
import { cqManageReminderTime } from "./controllers/callbackQuery/manage-appointment/reminder/manageReminderTime";
import { cqSelectReminderType } from "./controllers/callbackQuery/manage-appointment/reminder/selectReminderType";
import { cqConfirmSetReminder } from "./controllers/callbackQuery/manage-appointment/reminder/confirmSetReminder";
import { cqManageReminder } from "./controllers/callbackQuery/manage-appointment/reminder/manageReminder";
import { cqSelectCancelReminder } from "./controllers/callbackQuery/manage-appointment/reminder/selectCancelReminder";
import { cqCancelReminder } from "./controllers/callbackQuery/manage-appointment/reminder/cancelReminder";
/// CRON to send Auto Notification
import autoNotification from "./utils/autoNotification";

// Handle Telegram Bot Local Session
interface SessionData {
  lastManageApptMsg: number | null;
  selectedAppt: string | null;
  selectedReminderType: string | null;
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
  return { lastManageApptMsg: null, selectedAppt: null, selectedReminderType: null, userId: null };
}
bot.use(session({ initial: initial }));

// Command Handling
bot.command("start", startController)
bot.command("link", linkController);
bot.command("unlink", unlinkController);
bot.command("upcoming", upcomingController);

// Handle Inline Keyboard Clicks
/// Manage Appointments
bot.callbackQuery("manage-appointments", cqManageAppointments);
//// Manage Appointment Options (Reschedule, Cancel, Manage Reminder)
bot.callbackQuery("reschedule-appt", cqRescheduleAppointment);
bot.callbackQuery("cancel-appt", cqCancelAppointment);
bot.callbackQuery("manage-reminder-appt", cqManageReminder);
///// Manage Reminder Options (Create, Cancel)
bot.callbackQuery("create-appt-reminder", cqManageReminderTime);
bot.callbackQuery("cancel-appt-reminder", cqSelectCancelReminder);
/// Back Button Handlers
bot.callbackQuery("back-to-manage-appt", cqManageAppointments);
bot.callbackQuery("back-to-manage-appt-optns", cqManageReminder);
bot.callbackQuery("back-to-manage-reminder-optns", cqManageReminder);
bot.callbackQuery("back-to-reminder-time", cqManageReminderTime);
/// Catch-All for Callback Queries
bot.on("callback_query:data", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  // Selection of Appointment (Manage Appointment)
  if (callbackData.startsWith("manage-appt-")) {
    ctx.session.selectedAppt = callbackData.replace("manage-appt-", "");
    cqManageAppointmentSelection(ctx);
  }
  // Selection of Reminder Time Slot
  if (callbackData.startsWith("appt-reminder-type-")) {
    ctx.session.selectedReminderType = callbackData.replace("appt-reminder-type-", "");
    cqSelectReminderType(ctx);
  }
  // Selection of Reminder Type
  if (callbackData.startsWith("reminder-area-")) {
    cqConfirmSetReminder(ctx, callbackData.replace("reminder-area-", ""));
  }
  // Cancellation of Reminder
  if (callbackData.startsWith("reminder-type-")) {
    cqCancelReminder(ctx, callbackData.replace("reminder-type-", ""));
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

// Handle Auto Notification CRON Job
autoNotification(bot);

// Start the Bot
console.log("Telegram Bot Started");
bot.start();

export default bot;