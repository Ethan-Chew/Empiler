import supabase from "../utils/supabase.js";

const uploadAttachment = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: "Error",
                message: "No file uploaded"
            });
        }

        const { caseId } = req.body;
        if (!caseId) {
            return res.status(400).json({
                status: "Error",
                message: "caseId is required in the request body."
            });
        }

        const { data, error } = await supabase.storage.from("chat-images").upload(`${caseId}/${req.file.originalname}`, req.file.buffer, {
            contentType: req.file.mimetype,
        });
        if (error) {
            throw new Error(error.message);
        } else {
            return res.status(201).json({
                status: "Success",
                message: "File uploaded successfully",
                filePath: data.fullPath,
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