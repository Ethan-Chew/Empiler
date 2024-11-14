import express from "express";
import UserController from "../controllers/user.controller.js";

const router = express.Router()

router.route("/user")
    .get(UserController.getUser)

export default router