/*
    isSender: bool - true if the message is sent by the user, false if it is received
    messages: array - array of messages to display in the a container
    timestamp: string - timestamp of the message
*/

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"

export default function MessageContainer({ isSender, message, fileUrl, timestamp }) {
    return (
        <div className={`${isSender && "ml-auto"} flex flex-col max-w-sm md:max-w-xl`}>
            <div className="flex flex-col gap-1">
                <div className={`${isSender ? "bg-chatred" : "bg-gray-500"} ${message ? "p-2" : "p-5"} rounded-lg`}>
                    {message ? <p className="text-white">{message}</p> : <ImageViewer fileUrl={fileUrl} />}
                </div>
            </div>
            <p className={`${isSender ? "ml-auto text-chatred" : "text-gray-500"}`}>{ timestamp }</p>
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
                        layoutId={fileUrl}
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