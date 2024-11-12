import speech from '@google-cloud/speech';
import dotenv from 'dotenv';
import request from './sttConfig.js';

dotenv.config();
const credentials = JSON.parse(process.env.GOOGLE_TRANSLATE_KEY);
const speechClient = new speech.SpeechClient({
    credentials: credentials,
    projectId: credentials.project_id
});

export default class SpeechToText {
    static async startRecognitionStream(socket, customerSessionIdentifier, recogniseStream) {
        try {
            recogniseStream = speechClient
                .streamingRecognize(request)
                .on('error', () => {
                    throw new Error(err)
                })
                .on('data', (data) => {
                    const results = data.results[0];
                    const isFinal = results.isFinal;

                    const transcription = data.results
                        .map((result) => result.alternatives[0].transcript)
                        .join("\n");

                    console.log(`Transcription: `, transcription);

                    socket.to(customerSessionIdentifier).emit("stt:receive-text", {
                        text: transcription,
                        isFinal: isFinal,
                    });
                });
        } catch (err) {
            throw new Error(err);
        }
    }

    static async stopRecognitionStream(recogniseStream) {
        if (recogniseStream) {
            recogniseStream.end();
        }
        recogniseStream = null;
    }
}