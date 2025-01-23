import supabase from "./supabase.js";
import nodemailer from "nodemailer";
import cron from "node-cron";
import dotenv from "dotenv";
import Appointment from "../models/appointment.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NOTIF_EMAIL,
        pass: process.env.NOTIF_EMAIL_PASSWORD,
    },
});

export default async function startAutoNotifJob() {
    // A Cron Job that runs every hour
    try {
        cron.schedule("0 * * * *",  async () => {
            const data = await Appointment.getAllAppointmentReminders("email");
            const currentUnixMS = new Date().getTime();
            const sentApptIds = [];

            if (data.length > 0) {
                data.forEach(async (appt) => {
                    appt.reminders.forEach(async (reminder) => {
                        if (reminder.reminderTime > currentUnixMS) {
                            return;
                        }
                        
                        const email = appt.user.email;
                        const mailOptions = {
                            from: `OCBC Support ${process.env.NOTIF_EMAIL}`,
                            to: email,
                            subject: "Appointment Reminder",
                            text: `Dear ${appt.user.name}, this is a reminder for your appointment at ${appt.branchName} on ${appt.date} at ${appt.timeslot.timeslot}.`
                        }
        
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.error(err);
                            } else {
                                sentApptIds.push({
                                    apptId: appt.id,
                                    reminderId: reminder.reminderId
                                });
                            }
                        });
                    })
                })

                // Remove all sent reminders from the database
                await Appointment.deleteAppointmentReminders(sentApptIds);
            }
        })
    } catch (error) {
        console.error(error);
    }
}