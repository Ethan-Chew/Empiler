import express from 'express';
import TicketController from '../controllers/ticket.controller.js';

const router = express.Router();

// Route for getting all tickets and creating a new ticket
router.route('/tickets')
    .get(TicketController.getAllTickets)
    .post(TicketController.createTicket);

// Route for getting open tickets
router.route('/tickets/open')
    .get(TicketController.getOpenTickets);

// Route for getting closed tickets
router.route('/tickets/closed')
    .get(TicketController.getClosedTickets);

// Route for getting, updating, and deleting tickets by ticket ID
router.route('/tickets/:ticketId')
    .get(TicketController.getTicketById)
    .put(TicketController.updateTicket)
    .delete(TicketController.deleteTicket);

// Route for getting tickets by customer ID
router.route('/tickets/customer/:custId')
    .get(TicketController.getTicketsByCustomerId);

// Route for getting tickets by admin ID
router.route('/tickets/admin/:adminId')
    .get(TicketController.getTicketsByAdminId);

// Route for getting categories
router.route('/categories')
    .get(TicketController.getCategories);

export default router;
