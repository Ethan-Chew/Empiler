import express from "express";
import UserController from "../controllers/user.controller.js";
import authoriseJWT from "../middleware/authoriseJWT.js";

const router = express.Router()

router.route("/staff-feedback/:id")
    .get(UserController.getStaffFeedback);

router.route("/monthly-chat-counts/:id")
    .get(UserController.getMonthlyChatCounts);

router.route("/")
    .get(UserController.getUser)

router.route("/:id")
    .get(UserController.getUserWithId)

export default router