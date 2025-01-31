import express from "express";
import telegramappointmentController from "../controllers/telegram/telegramappointments.controller.js";

const router = express.Router()

// Route to get chat by chat ID
router.route("/upcoming/:telegramId")
    .get(telegramappointmentController.retrieveRemindersForTeleUser);

export default router;