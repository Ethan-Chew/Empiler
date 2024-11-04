/*
    isSender: bool - true if the message is sent by the user, false if it is received
    messages: array - array of messages to display in the a container
    timestamp: string - timestamp of the message
*/

import { formatTimestamp } from "../../utils/formatTimestamp";

export default function MessageContainer({ isSender, messages, timestamp }) {
    return (
        <div className={`${isSender && "ml-auto"} flex flex-col max-w-sm md:max-w-xl`}>
            <div className="flex flex-col gap-1">
                {messages.map((message, index) => (
                    <div key={index} className={`${isSender ? "bg-chatred" : "bg-gray-500"} ${messages.length > 1 && index < messages.length ? "" : ""} p-2 rounded-lg`}>
                        <p className="text-white">{message}</p>
                    </div>
                ))}
            </div>
            <p className={`${isSender ? "ml-auto text-chatred" : "text-gray-500"}`}>{ formatTimestamp(timestamp) }</p>
        </div>
    );
}