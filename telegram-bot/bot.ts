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
import { cqRescheduleAppointment } from "./controllers/callbackQuery/manage-appointment/reschedule/rescheduleAppointment";
import { cqCancelAppointment } from "./controllers/callbackQuery/manage-appointment/cancelAppointment";
import { cqManageReminderTime } from "./controllers/callbackQuery/manage-appointment/reminder/manageReminderTime";
import { cqSelectReminderType } from "./controllers/callbackQuery/manage-appointment/reminder/selectReminderType";
import { cqConfirmSetReminder } from "./controllers/callbackQuery/manage-appointment/reminder/confirmSetReminder";
import { cqManageReminder } from "./controllers/callbackQuery/manage-appointment/reminder/manageReminder";
import { cqSelectCancelReminder } from "./controllers/callbackQuery/manage-appointment/reminder/selectCancelReminder";
import { cqCancelReminder } from "./controllers/callbackQuery/manage-appointment/reminder/cancelReminder";
import { cqChooseRescheduleTime } from "./controllers/callbackQuery/manage-appointment/reschedule/chooseRescheduleTime";
import { cqConfirmRescheduleAppointment } from "./controllers/callbackQuery/manage-appointment/reschedule/confirmRescheduleAppointment";
/// CRON to send Auto Notification
import autoNotification from "./utils/autoNotification";

// Handle Telegram Bot Local Session
interface SessionData {
  lastManageApptMsg: number | null
  selectedAppt: string | null
  selectedReminderType: string | null
  userId: string | null
  displayApptDateOffset: number
  selectedBranch: string | null
}

export type MyContext = Context & SessionFlavor<SessionData>;

const token = process.env.TELEGRAM_API_KEY || "";
const bot = new Bot<MyContext>(token);
if (process.env.ENVIRONMENT === "development") {
    bot.use(generateUpdateMiddleware());
}

// Return Initial Session Data
function initial(): SessionData {
  return { lastManageApptMsg: null, selectedAppt: null, selectedReminderType: null, userId: null, displayApptDateOffset: 0, selectedBranch: null };
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
bot.callbackQuery("back-to-manage-appt-selection", cqManageAppointmentSelection);
bot.callbackQuery("back-to-manage-reminder-optns", cqManageReminder);
bot.callbackQuery("back-to-reminder-time", cqManageReminderTime);
bot.callbackQuery("back-to-reschedule-appt", cqRescheduleAppointment);
/// Catch-All for Callback Queries
bot.on("callback_query:data", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  // Selection of Appointment (Manage Appointment)
  if (callbackData.startsWith("manage-appt-")) {
    const data = callbackData.replace("manage-appt-", "").split(":");
    ctx.session.selectedAppt = data[0];
    ctx.session.selectedBranch = data[1];
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

  // Handle Appointment Reschedule
  if (callbackData.startsWith("reschedule-appt-")) {
    // Handle Date Navigation
    if (callbackData === "reschedule-appt-previous-5-days") {
      ctx.session.displayApptDateOffset -= 1;
      cqRescheduleAppointment(ctx);
    } else if (callbackData === "reschedule-appt-next-5-days") {
      ctx.session.displayApptDateOffset += 1;
      cqRescheduleAppointment(ctx);
    } else if (callbackData.startsWith("reschedule-appt-datetime")) {
      // Confirm Reschedule
      const datetime = callbackData.replace("reschedule-appt-datetime-", "");
      const separatorIndex = datetime.lastIndexOf('-');
      const date = datetime.substring(0, separatorIndex);
      const timeslotId = datetime.substring(separatorIndex + 1);
      cqConfirmRescheduleAppointment(ctx, date, parseInt(timeslotId));
    } else {
      // Handle Date Selection
      cqChooseRescheduleTime(ctx, callbackData.replace("reschedule-appt-", ""));
    }
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

// Setup default Bot Commands
bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "link", description: "Link the bot to your OCBC Account" },
]);

// Start the Bot
console.log("Telegram Bot Started");
bot.start();

export default bot;