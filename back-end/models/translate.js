import { v2 } from "@google-cloud/translate";
import ISO6391 from 'iso-639-1';
import { dotenv } from "dotenv";
dotenv.config();

// Configure Credentials
const credentials = JSON.parse(process.env.GOOGLE_TRANSLATE_KEY);

const translate = new v2.Translate({
    credentials: credentials,
    projectId: credentials.project_id
});

export default class Translate {
    static async detectLanguage(text) {
        try {
            const detectResponse = await translate.detect(text);
            return {
                status: "success",
                languageCode: detectResponse[0].language,
                languageFull: ISO6391.getName(detectResponse[0].language)
            };
        } catch (err) {
            return {
                status: "error",
                message: err.message
            };
        }
    }

    static async translateText(text, targetLanguage) {
        try {
            const translateResponse = await translate.translate(text, targetLanguage);
            return {
                status: "success",
                translatedText: translateResponse[0]
            };
        } catch (err) {
            return {
                status: "error",
                message: err.message
            };
        }
    }
}