import supabase from "../utils/supabase.js";
import TicketEmail from "../utils/ticketEmail.js";
import User from "./user.js";

export default class Ticket {
    constructor (ticketId, dateCreated, detail, category, custId, reply, adminId, dateUpdated, status) {
        this.ticketId = ticketId;
        this.dateCreated = dateCreated;
        this.detail = detail;
        this.category = category;
        this.custId = custId;
        this.reply = reply || null;
        this.adminId = adminId || null;
        this.dateUpdated = dateUpdated || null;
        this.status = status;
    }

    // Retrieve all tickets
    static async getAllTickets() {
        const { data, error } = await supabase
            .from("tickets")
            .select("*");

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // Retrieve open tickets
    static async getOpenTickets() {
        const { data, error } = await supabase
            .from("tickets")
            .select("*")
            .eq("status", "Open");

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // Retrieve closed tickets
    static async getClosedTickets() {
        const { data, error } = await supabase
            .from("tickets")
            .select("*")
            .eq("status", "Closed");

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // Retrieve ticket by ticket ID
    static async getTicketById(ticketId) {
        const { data, error } = await supabase
            .from("tickets")
            .select("*")
            .eq("ticketId", ticketId)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // Retrieve tickets by customer ID
    static async getTicketsByCustomerId(custId) {
        const { data, error } = await supabase
            .from("tickets")
            .select("*")
            .eq("custId", custId);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // Retrieve tickets by admin ID
    static async getTicketsByAdminId(adminId) {
        const { data, error } = await supabase
            .from("tickets")
            .select("*")
            .eq("adminId", adminId);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // Create a new ticket
    static async createTicket(ticket) {
        const { data, error } = await supabase
            .from("tickets")
            .insert(ticket);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // Update ticket
    static async updateTicket(ticketId, ticket) {
        const { data, error } = await supabase
            .from("tickets")
            .update(ticket)
            .eq("ticketId", ticketId);

        if (error) {
            throw new Error(error.message);
        }

        // Retrieve updated ticket
        const updatedTicket = await Ticket.getTicketById(ticketId);

        // Retrieve customer email
        const customer = await User.getUserWithId(updatedTicket.custId);
        const customerEmail = customer.email;

        // Send email notification
        await TicketEmail.sendTicketEmail(ticket, customerEmail);

        return data;
    }

    // Delete ticket
    static async deleteTicket(ticketId) {
        const { error } = await supabase
            .from("tickets")
            .delete()
            .eq("ticketId", ticketId);

        if (error) {
            throw new Error(error.message);
        }

        return true;
    }

    // Retrieve categories
    static async getCategories() {
        const { data, error } = await supabase
            .from("ticket_categories")
            .select("*");

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

}