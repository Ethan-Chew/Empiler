import express from "express";
import telegramhandlerController from "../controllers/telegramhandler.controller";

const router = express.Router()

// Route to get chat by chat ID
router.route("/link")
    .post(telegramhandlerController.linkAccount);

export default router;