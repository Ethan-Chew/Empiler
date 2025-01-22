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
                    if (appt.reminderTime > currentUnixMS) {
                        return;
                    }

                    // Retrieve user email for each appointment
                    const { userData, userError } = await supabase
                        .from("user")
                        .select("*")
                        .eq("id", appt.branchappt.userId);
                    
                    if (userError) {
                        console.error(userError);
                        return;
                    }
    
                    const email = userData[0].email;
                    const mailOptions = {
                        from: `OCBC Support ${process.env.NOTIF_EMAIL}`,
                        to: email,
                        subject: "Appointment Reminder",
                        text: `Dear ${userData[0].name}, this is a reminder for your appointment at ${appt.branchappt.branchName} on ${appt.branchappt.date} at ${appt.branchappt.timeslot.timeslot}.`
                    }
    
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.error(err);
                        } else {
                            sentApptIds.push(appt.id);
                        }
                    });
                })

                // Remove all sent reminders from the database
                await Appointment.deleteAppointmentReminder(sentApptIds);
            }
        })
    } catch (error) {
        console.error(error);
    }
}