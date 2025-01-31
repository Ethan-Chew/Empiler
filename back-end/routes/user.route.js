import express from "express";
import UserController from "../controllers/user.controller.js";
import authoriseJWT from "../middleware/authoriseJWT.js";

const router = express.Router()

router.route("/:id", authoriseJWT)
    .get(UserController.getUserWithId)

router.route("/staff-feedback")
    .get(authoriseJWT, UserController.getStaffFeedback);

router.route("/monthly-chat-counts")
    .get(authoriseJWT, UserController.getMonthlyChatCounts);
export default router