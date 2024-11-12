import express from "express";
import translateController from "../controllers/translate.controller.js";

const router = express.Router()

router.route("/detectlang")
    .post(translateController.detectLanguage);

router.route("/translate")
    .post(translateController.translateText);

export default router