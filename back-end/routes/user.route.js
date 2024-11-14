import express from "express";
import UserController from "../controllers/user.controller.js";
import authoriseJWT from "../middleware/authoriseJWT.js";

const router = express.Router()

router.route("/user", authoriseJWT)
    .get(UserController.getUser)

export default router