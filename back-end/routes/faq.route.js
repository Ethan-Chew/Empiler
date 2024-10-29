import express from "express";
import FreqAskedQnsController from "../controllers/faq.controller";

const router = express.Router()

// Route to create a new FAQ
router.route("/faq/create")
    .post(FreqAskedQnsController.createFaq);

// Route to get all FAQs
router.route("/faq")
    .get(FreqAskedQnsController.getAllFaqs);

// Route to get FAQ by title
router.route("/faq/:title")
    .get(FreqAskedQnsController.getFaqByTitle);

// Route to get FAQ by section
router.route("/faq/:section")
    .get(FreqAskedQnsController.getFaqBySection);

// Route to update an FAQ 
router.route("/faq/update")
    .put(FreqAskedQnsController.updateFaq);

// Route to delete an FAQ
router.route("/faq/delete")
    .delete(FreqAskedQnsController.deleteFaq);

router.route("/routes")

router.route("/questions")

export default router