"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const unlinkController_1 = require("./controllers/unlinkController");
const upcomingController_1 = require("./controllers/upcomingController");
/// Context Query Controllers
const manageAppointments_1 = require("./controllers/callbackQuery/manageAppointments");
const manageAppointmentSelection_1 = require("./controllers/callbackQuery/manage-appointment/manageAppointmentSelection");
const rescheduleAppointment_1 = require("./controllers/callbackQuery/manage-appointment/reschedule/rescheduleAppointment");
const cancelAppointment_1 = require("./controllers/callbackQuery/manage-appointment/cancelAppointment");
const manageReminderTime_1 = require("./controllers/callbackQuery/manage-appointment/reminder/manageReminderTime");
const selectReminderType_1 = require("./controllers/callbackQuery/manage-appointment/reminder/selectReminderType");
const confirmSetReminder_1 = require("./controllers/callbackQuery/manage-appointment/reminder/confirmSetReminder");
const manageReminder_1 = require("./controllers/callbackQuery/manage-appointment/reminder/manageReminder");
const selectCancelReminder_1 = require("./controllers/callbackQuery/manage-appointment/reminder/selectCancelReminder");
const cancelReminder_1 = require("./controllers/callbackQuery/manage-appointment/reminder/cancelReminder");
const chooseRescheduleTime_1 = require("./controllers/callbackQuery/manage-appointment/reschedule/chooseRescheduleTime");
const confirmRescheduleAppointment_1 = require("./controllers/callbackQuery/manage-appointment/reschedule/confirmRescheduleAppointment");
/// CRON to send Auto Notification
const autoNotification_1 = __importDefault(require("./utils/autoNotification"));
const token = process.env.TELEGRAM_API_KEY || "";
const bot = new grammy_1.Bot(token);
if (process.env.ENVIRONMENT === "development") {
    bot.use((0, telegraf_middleware_console_time_1.generateUpdateMiddleware)());
}
// Return Initial Session Data
function initial() {
    return { lastManageApptMsg: null, selectedAppt: null, selectedReminderType: null, userId: null, displayApptDateOffset: 0 };
}
bot.use((0, grammy_1.session)({ initial: initial }));
// Command Handling
bot.command("start", startController_1.startController);
bot.command("link", linkController_1.linkController);
bot.command("unlink", unlinkController_1.unlinkController);
bot.command("upcoming", upcomingController_1.upcomingController);
// Handle Inline Keyboard Clicks
/// Manage Appointments
bot.callbackQuery("manage-appointments", manageAppointments_1.cqManageAppointments);
//// Manage Appointment Options (Reschedule, Cancel, Manage Reminder)
bot.callbackQuery("reschedule-appt", rescheduleAppointment_1.cqRescheduleAppointment);
bot.callbackQuery("cancel-appt", cancelAppointment_1.cqCancelAppointment);
bot.callbackQuery("manage-reminder-appt", manageReminder_1.cqManageReminder);
///// Manage Reminder Options (Create, Cancel)
bot.callbackQuery("create-appt-reminder", manageReminderTime_1.cqManageReminderTime);
bot.callbackQuery("cancel-appt-reminder", selectCancelReminder_1.cqSelectCancelReminder);
/// Back Button Handlers
bot.callbackQuery("back-to-manage-appt", manageAppointments_1.cqManageAppointments);
bot.callbackQuery("back-to-manage-appt-optns", manageReminder_1.cqManageReminder);
bot.callbackQuery("back-to-manage-reminder-optns", manageReminder_1.cqManageReminder);
bot.callbackQuery("back-to-reminder-time", manageReminderTime_1.cqManageReminderTime);
bot.callbackQuery("back-to-reschedule-appt", rescheduleAppointment_1.cqRescheduleAppointment);
/// Catch-All for Callback Queries
bot.on("callback_query:data", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const callbackData = ctx.callbackQuery.data;
    // Selection of Appointment (Manage Appointment)
    if (callbackData.startsWith("manage-appt-")) {
        ctx.session.selectedAppt = callbackData.replace("manage-appt-", "");
        (0, manageAppointmentSelection_1.cqManageAppointmentSelection)(ctx);
    }
    // Selection of Reminder Time Slot
    if (callbackData.startsWith("appt-reminder-type-")) {
        ctx.session.selectedReminderType = callbackData.replace("appt-reminder-type-", "");
        (0, selectReminderType_1.cqSelectReminderType)(ctx);
    }
    // Selection of Reminder Type
    if (callbackData.startsWith("reminder-area-")) {
        (0, confirmSetReminder_1.cqConfirmSetReminder)(ctx, callbackData.replace("reminder-area-", ""));
    }
    // Cancellation of Reminder
    if (callbackData.startsWith("reminder-type-")) {
        (0, cancelReminder_1.cqCancelReminder)(ctx, callbackData.replace("reminder-type-", ""));
    }
    // Handle Appointment Reschedule
    if (callbackData.startsWith("reschedule-appt-")) {
        // Handle Date Navigation
        if (callbackData === "reschedule-appt-previous-5-days") {
            ctx.session.displayApptDateOffset -= 1;
            (0, rescheduleAppointment_1.cqRescheduleAppointment)(ctx);
        }
        else if (callbackData === "reschedule-appt-next-5-days") {
            ctx.session.displayApptDateOffset += 1;
            (0, rescheduleAppointment_1.cqRescheduleAppointment)(ctx);
        }
        else if (callbackData.startsWith("reschedule-appt-datetime")) {
            // Confirm Reschedule
            const datetime = callbackData.replace("reschedule-appt-datetime-", "");
            const separatorIndex = datetime.lastIndexOf('-');
            const date = datetime.substring(0, separatorIndex);
            const timeslotId = datetime.substring(separatorIndex + 1);
            (0, confirmRescheduleAppointment_1.cqConfirmRescheduleAppointment)(ctx, date, parseInt(timeslotId));
        }
        else {
            // Handle Date Selection
            (0, chooseRescheduleTime_1.cqChooseRescheduleTime)(ctx, callbackData.replace("reschedule-appt-", ""));
        }
    }
    // await ctx.answerCallbackQuery(); // remove loading animation
}));
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
// Handle Auto Notification CRON Job
(0, autoNotification_1.default)(bot);
// Start the Bot
console.log("Telegram Bot Started");
bot.start();
exports.default = bot;
