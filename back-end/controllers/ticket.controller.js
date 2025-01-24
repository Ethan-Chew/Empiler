import Ticket from "../models/ticket.js";

const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.getAllTickets();

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ error: "No tickets found" });
        }

        res.status(200).json(tickets);
    } catch (error) {
        console.error("Error in getAllTickets:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getOpenTickets = async (req, res) => {
    try {
        const tickets = await Ticket.getOpenTickets();

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ error: "No open tickets found" });
        }
        res.status(200).json(tickets);

    } catch (error) {
        console.error("Error in getOpenTickets:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getClosedTickets = async (req, res) => {
    try {
        const tickets = await Ticket.getClosedTickets();

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ error: "No closed tickets found" });
        }
        res.status(200).json(tickets);

    } catch (error) {
        console.error("Error in getClosedTickets:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTicketById = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const ticket = await Ticket.getTicketById(ticketId);

        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }
        res.status(200).json(ticket);

    } catch (error) {
        console.error("Error in getTicketById:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTicketsByCustomerId = async (req, res) => {
    try {
        const custId = req.params.custId;
        const tickets = await Ticket.getTicketsByCustomerId(custId);

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ error: "No tickets found for this customer" });
        }
        res.status(200).json(tickets);

    } catch (error) {
        console.error("Error in getTicketsByCustomerId:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTicketsByAdminId = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        const tickets = await Ticket.getTicketsByAdminId(adminId);

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ error: "No tickets found for this admin" });
        }
        res.status(200).json(tickets);

    } catch (error) {
        console.error("Error in getTicketsByAdminId:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const createTicket = async (req, res) => {
    try {
        const ticket = req.body;
        const newTicket = await Ticket.createTicket(ticket);
        res.status(201).json(newTicket);

    } catch (error) {
        console.error("Error in createTicket:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateTicket = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const ticket = req.body;
        const updatedTicket = await Ticket.updateTicket(ticketId, ticket);

        if (!updatedTicket) {
            return res.status(404).json({ error: "Ticket not found" });
        }
        res.status(200).json(updatedTicket);

    } catch (error) {
        console.error("Error in updateTicket:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteTicket = async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const deletedTicket = await Ticket.deleteTicket(ticketId);

        if (!deletedTicket) {
            return res.status(404).json({ error: "Ticket not found" });
        }
        res.status(200).json(deletedTicket);

    } catch (error) {
        console.error("Error in deleteTicket:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Ticket.getCategories();
        res.status(200).json(categories);

    } catch (error) {
        console.error("Error in getCategories:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default {
    getAllTickets,
    getOpenTickets,
    getClosedTickets,
    getTicketById,
    getTicketsByCustomerId,
    getTicketsByAdminId,
    createTicket,
    updateTicket,
    deleteTicket,
    getCategories
};