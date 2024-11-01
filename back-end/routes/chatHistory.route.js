import express from "express";
import ChatHistoryController from "../controllers/chatHistory.controller.js";

const router = express.Router()

// Route to get chat by chat ID
router.route("/:id")
    .get(ChatHistoryController.getChatById);

// Route to get chat by customer ID
router.route("/:customerId")
    .get(ChatHistoryController.getChatByCustomerId);

// Route to get chat by staff ID
router.route("/:staffId")
    .get(ChatHistoryController.getChatByStaffId);

// Route to create chat history
router.route("/create")
    .post(ChatHistoryController.createChatHistory);

// Route to delete chat history
router.route("/delete/:id")
    .delete(ChatHistoryController.deleteChatHistory);

router.route("/")

export default router;