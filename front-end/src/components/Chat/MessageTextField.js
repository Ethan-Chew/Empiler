import { FaArrowCircleUp } from "react-icons/fa";
import { AiFillPlusCircle } from "react-icons/ai";
import { PiWaveformLight } from "react-icons/pi";
import { BsRecord2 } from "react-icons/bs";
import { useEffect, useState, useRef } from "react";

const sampleRate = 16000;

const getMediaStream = () => {
    return navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: "default",
          sampleRate: sampleRate,
          sampleSize: 16,
          channelCount: 1,
        },
        video: false,
    });
}

export default function MessageTextField({ setSentMessage, sentMessage, sendMessage, onUploadClick, socket }) {
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState();
    const [currentRecognition, setCurrentRecognition] = useState(null);
    const [recognitionHistory, setRecognitionHistory] = useState(null);
    const processorRef = useRef();
    const audioContextRef = useRef();
    const audioInputRef = useRef();

    const handleSTTRecording = () => {
        setIsRecording(prev => {
            if (prev) { // Was Recording, so now stop recording
                socket.emit("stt:end-stream");
                processorRef.current?.disconnect();
                audioInputRef.current?.disconnect();
                audioContextRef.current?.close();
                setRecorder(undefined);
                setIsRecording(false);
            } else {
                socket.emit("stt:start-stream", sessionStorage.getItem("customerSessionIdentifier"));
            }
            return !prev;
        });
    }

    useEffect(() => {
        const handleReceiveTranscript = (data) => {
            console.log(data)
            if (data.isFinal) {
                setCurrentRecognition("...");
                setRecognitionHistory((old) => [data.text, ...old]);
            } else setCurrentRecognition(data.text + "...");
        }

        socket.on("stt:receive-text", (data) => {
            handleReceiveTranscript(data);
            console.log("Received Transcript: ", data)
        });
    }, [])

    // Handle Recording Audio Stream
    useEffect(() => {
        async function startRecordingWorkload() {
            if (!isRecording) return;

            const audioStream = await getMediaStream();
            audioContextRef.current = new window.AudioContext();

            await audioContextRef.current.audioWorklet.addModule("/worklet/recorderWorkletProcessor.js");

            audioContextRef.current.resume();

            audioInputRef.current = audioContextRef.current.createMediaStreamSource(audioStream);

            processorRef.current = new AudioWorkletNode(
                audioContextRef.current,
                "recorder.worklet"
            );

            processorRef.current.connect(audioContextRef.current.destination);
            audioContextRef.current.resume();

            audioInputRef.current.connect(processorRef.current);

            processorRef.current.port.onmessage = (event) => {
                const audioData = event.data;
                socket.emit("stt:send-audio-data", { audio: audioData });
            };
            setIsRecording(true);
        }

        startRecordingWorkload();

        return () => {
            if (isRecording) {
                processorRef.current?.disconnect();
                audioInputRef.current?.disconnect();
                if (audioContextRef.current?.state !== "closed") {
                    audioContextRef.current?.close();
                }
            }
        }
    }, [isRecording, recorder])

    return (
        <div className="px-10 py-6 md:py-4 w-full rounded-b-xl flex flex-row justify-between">
            <button className="border-2 rounded-xl px-4 hover:border-neutral-500 duration-200" onClick={onUploadClick}>
                <AiFillPlusCircle className="text-3xl text-neutral-400 hover:text-neutral-500" />
            </button>
            <div className="p-3 border-2 w-full rounded-xl mx-5 flex flex-row gap-3 items-center">
                <input 
                    className="outline-none w-full"
                    placeholder="Enter a Message.."
                    value={recognitionHistory === null ? sentMessage : recognitionHistory.join(" ")}
                    onChange={(e) => setSentMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage(null)}
                />
                <button onClick={handleSTTRecording} className="flex flex-row items-center w-fit">
                    {isRecording ? <RecordingIndicator setIsRecording={setIsRecording} /> : <PiWaveformLight className="text-neutral-400 hover:text-neutral-500 text-2xl" />}
                </button>
            </div>
            <button className="border-2 rounded-xl px-4 hover:border-neutral-500 duration-200" onClick={() => sendMessage(null)}>
                <FaArrowCircleUp className="text-2xl text-neutral-400 hover:text-neutral-500" />
            </button>
        </div>
    );
}

function RecordingIndicator({ setIsRecording }) {
    const [recordDuration, setRecordDuration] = useState(0);
    const maxLength = 30;

    useEffect(() => {
        const interval = setInterval(() => {
            setRecordDuration(prev => {
                if (recordDuration >= maxLength) {
                    setIsRecording(false);
                    clearInterval(interval);
                    return 0;
                }
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    return (
        <>
            <BsRecord2 className="text-2xl text-red-500" />
            <p className="text-red-500">{recordDuration}s</p>
        </>
    )
}