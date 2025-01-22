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
            // Retrieve upcoming appointments from the database
            // const upcomingReminders = await axios.get(`http://localhost:8080/api/appointments/reminders/telegram`);
            // if (upcomingReminders.status !== 200) {
            //     console.log("An error occurred while retrieving upcoming reminders.");
            //     return;
            // }

            // const reminders = upcomingReminders.data;
            // // Check for reminders that needs to be sent, add a approx 10min buffer
            // const currentTime = new Date();
            // for (const reminder in reminders) {
            //     if (reminder.reminderTime >= currentTime) {
            //         const chatId = reminder.chatId;
            //         const reminderMessage = `Reminder: ${reminder.reminderMessage}`;
            //         await bot.api.sendMessage(chatId, reminderMessage);
            //     }
            // }
        })
    } catch (error) {
        console.log(error);
    }
}