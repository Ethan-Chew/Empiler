import express from "express";
import telegramhandlerController from "../controllers/telegram/telegramhandler.controller.js";

const router = express.Router()

// Route to get chat by chat ID
router.route("/link")
    .put(telegramhandlerController.linkAccount);

router.route("/unlink/:userId")
    .get(telegramhandlerController.unlinkAccount);

router.route("/create")
    .post(telegramhandlerController.createTelegramInfo);

router.route("/verify/tele/:telegramId")
    .get(telegramhandlerController.verifyTelegramLinked);

router.route("/verify/user/:userId")
    .get(telegramhandlerController.verifyUserTelegramLinked);

router.route("/:verificationCode")
    .get(telegramhandlerController.getTelegramInfo);

export default router;