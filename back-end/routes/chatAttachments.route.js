import express from "express";
import multer from "multer";
import chatAttachmentsController from "../controllers/chatAttachments.controller.js";

const router = express.Router()

// Handle Multer File Uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only images (jpg, jpeg, png) are accepted.'));
        }
        cb(undefined, true);
    }
});

// Route to get chat by chat ID
router.route("/")
    .post(upload.single('file'), chatAttachmentsController.uploadAttachment);
export default router;