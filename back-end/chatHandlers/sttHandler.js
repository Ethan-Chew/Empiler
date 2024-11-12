/*
    sttHandler, or Speech-to-Text Handler handles the real-time conversion of user's speech to text.
    An Audio Stream is received from the user's side, and Google Cloud Speech-to-Text API is used to convert the audio stream to text.
*/

import SpeechToText from "../utils/stt.js";

export default function (io, db, socket) {
    let recogniseStream;

    socket.on("stt:start-stream", (customerSessionIdentifier, data) => {
        SpeechToText.startRecognitionStream(socket, customerSessionIdentifier, recogniseStream);
    });

    socket.on("stt:end-stream", () => {
        SpeechToText.stopRecognitionStream(recogniseStream);
    });

    socket.on("stt:send-audio-data", async (audioData) => {
        if (recogniseStream !== null) {
            try {
                recogniseStream.write(audioData.audio);
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("Stream is not active");
        }
    })
}