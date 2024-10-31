import express from "express";
import AuthController from "../controllers/auth.controller.js";

const router = express.Router()

router.route("/login")
    .post(AuthController.authLoginUser)

router.route("/verify")
    .get(AuthController.authVerifyToken)

export default router