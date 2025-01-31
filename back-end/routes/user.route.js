import express from "express";
import UserController from "../controllers/user.controller.js";
import authoriseJWT from "../middleware/authoriseJWT.js";

const router = express.Router()

router.route("/:id", authoriseJWT)
    .get(UserController.getUserWithId)

export default router