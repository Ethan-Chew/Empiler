import express from "express";
import ChatHistoryController from "../controllers/chatHistory.controller.js";

const router = express.Router()

// Route to get chat by chat ID
router.route("/chats/:id")
    .get(ChatHistoryController.getChatById);

// Route to get chat by customer ID
router.route("/chats/:customerId")
    .get(ChatHistoryController.getChatByCustomerId);

// Route to get chat by staff ID
router.route("/chats/:staffId")
    .get(ChatHistoryController.getChatByStaffId);

// Route to create chat history
router.route("/chats/create")
    .post(ChatHistoryController.createChatHistory);

// Route to delete chat history
router.route("/chats/delete/:id")
    .delete(ChatHistoryController.deleteChatHistory);

router.route("/")

export default router;