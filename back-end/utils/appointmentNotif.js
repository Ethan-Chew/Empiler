import supabase from "./supabase.js";
import nodemailer from "nodemailer";
import cron from "node-cron";
import dotenv from "dotenv";

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
    cron.schedule("0 * * * *",  async () => {
        const { data, error } = await supabase
            .from("branch_appointments")
            .select(`
                name,
                date,
                timeslotId,
                branchName,
                appointment_timeslots (id, timeslot)    
            `)
            .gte('date', new Date().toISOString()) // Appointments after the current time
            .lte('date', new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()); // Appointments within the next 12 hours

        if (error) {
            console.error(error);
            return;
        }

        if (data.length > 0) {
            data.forEach(async (appt) => {
                // Retrieve user email for each appointment
                // TODO: Improve this method
                const { userData, userError } = await supabase
                    .from("user")
                    .select("*")
                    .eq("id", appt.name);
                
                if (userError) {
                    console.error(userError);
                    return;
                }

                const email = userData[0].email;
                const mailOptions = {
                    from: `OCBC Support ${process.env.NOTIF_EMAIL}`,
                    to: email,
                    subject: "Appointment Reminder",
                    text: `Dear ${userData[0].name}, this is a reminder for your appointment at ${appt.branchName} on ${appt.date} at ${appt.appointment_timeslots.timeslot}.`
                }

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error(err);
                    }
                });
            })
        }
    })
}