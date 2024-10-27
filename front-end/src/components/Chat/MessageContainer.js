/*
    isSender: bool - true if the message is sent by the user, false if it is received
    messages: array - array of messages to display in the a container
    timestamp: string - timestamp of the message
*/

export default function MessageContainer({ isSender, messages, timestamp }) {
    return (
        <div className={`${!isSender && "mr-auto"} flex flex-col`}>
            {messages.map((message, index) => (
                <div key={index} className={`p-2 ${isSender ? "bg-blue-500 rounded-br-none" : "bg-gray-500 rounded-bl-none"} rounded-lg`}>
                    <p className="text-white">{message}</p>
                </div>
            ))}
            <p>{ timestamp }</p>
        </div>
    );
}