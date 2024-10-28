import express from "express";
import ChatHistoryController from "../controllers/chatHistory.controller";

const router = express.Router()

// Route to get chat by chat ID
router.route("/chats/:id")
    .get(ChatHistoryController.getChatById);

// Route to get chat by customer ID
router.route("/customer/:customerId")
    .get(ChatHistoryController.getChatByCustomerId);

// Route to get chat by staff ID
router.route("/staff/:staffId")
    .get(ChatHistoryController.getChatByStaffId);

router.route("/")

export default router;