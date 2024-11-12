/*
    sttHandler, or Speech-to-Text Handler handles the real-time conversion of user's speech to text.
    An Audio Stream is received from the user's side, and Google Cloud Speech-to-Text API is used to convert the audio stream to text.
*/

import speech from '@google-cloud/speech';
import dotenv from 'dotenv';
import request from '../utils/sttConfig.js';

dotenv.config();
const credentials = JSON.parse(process.env.GOOGLE_TRANSLATE_KEY);
const speechClient = new speech.SpeechClient({
    credentials: credentials,
    projectId: credentials.project_id
});

export default function (io, db, socket) {
    let recogniseStream = null;

    socket.on("stt:start-stream", (customerSessionIdentifier) => {
        console.log("Stream Started")
        startRecognitionStream(socket, customerSessionIdentifier, recogniseStream);
    });

    socket.on("stt:end-stream", () => {
        console.log("Stream Ended")
        stopRecognitionStream(recogniseStream);
    });

    socket.on("stt:send-audio-data", async (audioData) => {
        if (recogniseStream !== null && recogniseStream !== undefined) {
            try {
                recogniseStream.write(audioData.audio);
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("Stream is not active");
        }
    })

    async function startRecognitionStream(socket, customerSessionIdentifier) {
        try {
            recogniseStream = speechClient
                .streamingRecognize(request)
                .on('error', (err) => {
                    throw new Error(err)
                })
                .on('data', (data) => {
                    const results = data.results[0];
                    const isFinal = results.isFinal;

                    const transcription = data.results
                        .map((result) => result.alternatives[0].transcript)
                        .join("\n");

                    console.log(`Transcription: `, transcription);

                    let id = customerSessionIdentifier;
                    if (id === null) {
                        id = socket.user.id;
                    }

                    io.to(id).emit("stt:receive-text", {
                        text: transcription,
                        isFinal: isFinal,
                    });
                });
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }

    async function stopRecognitionStream(recogniseStream) {
        if (recogniseStream) {
            recogniseStream.end();
        }
        recogniseStream = null;
    }
}