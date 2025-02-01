import express from "express";
import UserController from "../controllers/user.controller.js";
import authoriseJWT from "../middleware/authoriseJWT.js";

const router = express.Router()

router.route("/staff-feedback")
    .get(authoriseJWT, UserController.getStaffFeedback);

router.route("/", authoriseJWT)
    .get(UserController.getUser)

router.route("/monthly-chat-counts")
    .get(authoriseJWT, UserController.getMonthlyChatCounts);

router.route("/staff/average-waiting-time")
    .get(authoriseJWT, UserController.getAverageWaitingTime);

export default router