import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default class TicketEmail {
    static async sendTicketEmail(ticket, email) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NOTIF_EMAIL,
                pass: process.env.NOTIF_EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: process.env.NOTIF_EMAIL,
            to: email
        };

        if (ticket.status === 'Cancelled') {
            mailOptions.subject = `Ticket #${ticket.ticketId} - Cancelled`;
            mailOptions.text = `Ticket #${ticket.ticketId} has been Cancelled. Please check the ticketing system for more details. \n\n Reply: ${ticket.reply}`;
        } else {
            mailOptions.subject = `Ticket #${ticket.ticketId} - Closed`;
            mailOptions.text = `Ticket #${ticket.ticketId} has been closed. Please check the ticketing system for more details. \n\n Reply: ${ticket.reply}`;
        }
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}