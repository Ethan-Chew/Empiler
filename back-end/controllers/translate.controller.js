import Translate from "../models/translate.js";

const detectLanguage = async (req, res) => {
    try {
        const { text } = req.body;

        const detectResponse = await Translate.detectLanguage(text);
        if (detectResponse.status === "error") {
            throw new Error(detectResponse.message);
        }

        res.status(200).json(detectResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: err
        });
    }
}

const translateText = async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;

        const translateResponse = await Translate.translateText(text, targetLanguage);
        if (translateResponse.status === "error") {
            throw new Error(translateResponse.message);
        }

        res.status(200).json(translateResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: err
        });
    }
}

export default {
    detectLanguage,
    translateText
}