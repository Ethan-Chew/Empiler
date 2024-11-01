import express from "express";
import FreqAskedQnsController from "../controllers/faq.controller.js";

const router = express.Router()

// Route to create a new FAQ
router.route("/create")
    .post(FreqAskedQnsController.createFaq);

// Route to get all FAQs
router.route("/faq")
    .get(FreqAskedQnsController.getAllFaqs);

// Route to get FAQ by title
router.route("/:title")
    .get(FreqAskedQnsController.getFaqByTitle);

// Route to get FAQ by section
router.route("/:section")
    .get(FreqAskedQnsController.getFaqBySection);

// Route to update an FAQ 
router.route("/update")
    .put(FreqAskedQnsController.updateFaq);

// Route to delete an FAQ
router.route("/delete")
    .delete(FreqAskedQnsController.deleteFaq);

// Route to create an FAQ Section
router.route("/section/create")
    .post(FreqAskedQnsController.createFaqSection);

// Route to update an FAQ Section
router.route("/section/update")
    .put(FreqAskedQnsController.updateFaqSection);

// Route to delete an FAQ Section
router.route("/section/delete")
    .delete(FreqAskedQnsController.deleteFaqSection);

// Route to display all FAQ Section
router.route("/section")
    .get(FreqAskedQnsController.getAllSections);

router.route("/routes")

router.route("/questions")

export default router