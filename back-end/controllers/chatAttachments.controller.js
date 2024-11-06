import supabase from "../utils/supabase.js";
import dotenv from "dotenv";

const uploadAttachment = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: "Error",
                message: "No file uploaded"
            });
        }

        const { caseID } = req.body;
        if (!caseID) {
            return res.status(400).json({
                status: "Error",
                message: "caseID is required in the request body."
            });
        }

        const { data, error } = await supabase.storage.from("chat-images").upload(`${caseID}/${req.file.originalname}`, req.file.buffer, {
            contentType: req.file.mimetype,
        });
        if (error) {
            throw new Error(error.message);
        } else {
            return res.status(201).json({
                status: "Success",
                message: "File uploaded successfully",
                filePath: process.env.STORAGE_BUCKET_URL + data.fullPath,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
};

export default {
    uploadAttachment
}