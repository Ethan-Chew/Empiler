/*
    isSender: bool - true if the message is sent by the user, false if it is received
    messages: array - array of messages to display in the a container
    timestamp: string - timestamp of the message
*/

import { formatTimestamp } from "../../utils/formatTimestamp";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"
import ISO6391 from 'iso-639-1';
import AppointmentRecommendation from "./RecommendAppointment";

export default function MessageContainer({ isSender, message, fileUrl, timestamp }) {
    const locale = (navigator.language).split("-")[0];
    const [diffLanguage, setDiffLanguage] = useState(false);
    const [msg, setMsg] = useState(message);
    const [translatedMsg, setTranslatedMsg] = useState(null);
    const [translated, setTranslated] = useState(false);

    useEffect(() => {
        const verifyLocalisation = async () => {
            if (message && !isSender) {
                const detectLanguage = await fetch("http://localhost:8080/api/translate/detectlang", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ text: message })
                })

                if (detectLanguage.status === 200) {
                    const langData = await detectLanguage.json();
                    if (langData.languageCode !== locale) {
                        setDiffLanguage(true);
                    }
                }
            }
        }

        // DEV: pls comment this out else credits go byebye
        // verifyLocalisation();
    }, []);

    const isAppointmentMessage = fileUrl && fileUrl === 'appointment';

    const handleMessageTranslation = async () => {
        if (translated) {
            setTranslatedMsg(msg);
            setMsg(message);
            setTranslated(false);
        } else {
            if (translatedMsg === null) {
                const translateMessageReq = await fetch("http://localhost:8080/api/translate/translate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ text: message, targetLanguage: locale })
                });
        
                if (translateMessageReq.status === 200) {
                    const translatedMessage = await translateMessageReq.json();
                    setMsg(translatedMessage.translatedText);
                    setTranslated(true);
                }
            } else {
                setMsg(translatedMsg);
                setTranslated(true);
            }
        }
    }

    return (
        <div className={`${isSender && "ml-auto"} flex flex-col max-w-sm md:max-w-xl`}>
            <div className="flex flex-col gap-1">
                <div className={`${isSender ? "bg-chatred" : "bg-gray-500"} ${msg ? "p-2" : "p-5"} rounded-lg`}>
                    { fileUrl ? (isAppointmentMessage ? <AppointmentRecommendation /> : <ImageViewer fileUrl={fileUrl} />) : <p className="text-white">{msg}</p> }
                </div>
            </div>
            <div className="flex flex-row">
                <p className={`text-neutral-400 cursor-pointer ${diffLanguage ? "block" : "hidden"} ${isSender ? "" : "mr-auto"}`} onClick={handleMessageTranslation}>{ translated ? "Show Original" : `Translate to ${ ISO6391.getName(locale) }?` }</p>
                <p className={`${isSender ? "ml-auto text-chatred" : "text-gray-500"}`}>{ formatTimestamp(timestamp) }</p>
            </div>
        </div>
    );
}

function ImageViewer({ fileUrl }) {
    const [selectedId, setSelectedId] = useState(null);
  
    return (
      <>
        <div className="cursor-pointer max-w-[40vw] max-h-[20vh] overflow-hidden">
          <motion.img
            src={fileUrl}
            alt="Image"
            className="object-contain w-full h-full"
            layoutId={fileUrl} // Set a shared layoutId for animations
            onClick={() => setSelectedId(fileUrl)}
          />
        </div>
  
        <AnimatePresence>
          {selectedId && (
            <motion.div
                key="modal" 
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
                onClick={() => setSelectedId(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="relative max-w-[80vw] max-h-[80vh]"
                    layoutId={fileUrl}
                >
                    <motion.img
                        src={fileUrl}
                        alt="Large View"
                        className="object-contain w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.button
                        className="absolute top-0 right-0 p-4 text-white bg-black rounded-full"
                        onClick={() => setSelectedId(null)}
                    >
                        ✖
                    </motion.button>
                </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
}