import cron from 'node-cron';
import axios from 'axios';
import { Bot } from 'grammy';
import { MyContext } from '../bot';

/*
This function uses cron to run a script and retrieves the upcoming appointnments from the database every hour.
If the reminder's reminderTime > current time, the function will send a reminder to the user. 
*/

export default async function autoNotification(bot: Bot<MyContext>) {
    try {
        cron.schedule("0 * * * *", async () => {
            // Retrieve upcoming reminders from the database
            const upcomingReminders = await axios.get("http://localhost:8080/api/appointments/reminders/type/telegram");
            if (upcomingReminders.status !== 200) {
                console.log("An error occurred while retrieving upcoming reminders.");
                return;
            }

            const appointments = upcomingReminders.data;
            const currentTime = new Date();
            const sentReminders = [];
            for (const appointment of appointments) {
                for (const reminder of appointment.reminders) {
                    if (reminder.reminderTime <= currentTime) {
                        const telegramId = appointment.user.telegram[0].telegramId;
                        if (telegramId === null || telegramId === undefined) { continue; }
                        const reminderMessage = `Dear Customer,\nYou have an upcoming appointment at ${appointment.branchName} at ${appointment.date} from ${appointment.timeslot.timeslot}. Please be at least 10 minutes early for your appointment.\nThank you.`;
                        await bot.api.sendMessage(telegramId, reminderMessage);
                        sentReminders.push(reminder.reminderId);
                    }
                }
            }

            // Remove all sent reminders from the database
            if (sentReminders.length > 0) {
                await axios.delete("http://localhost:8080/api/appointments/reminders", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: {
                        reminderIds: sentReminders
                    }
                });
            }
        })
    } catch (error) {
        console.log(error);
    }
}