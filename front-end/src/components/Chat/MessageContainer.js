/*
    isSender: bool - true if the message is sent by the user, false if it is received
    messages: array - array of messages to display in the a container
    timestamp: string - timestamp of the message
*/

export default function MessageContainer({ isSender, message, fileUrl, timestamp }) {
    return (
        <div className={`${isSender && "ml-auto"} flex flex-col max-w-sm md:max-w-xl`}>
            <div className="flex flex-col gap-1">
                <div className={`${isSender ? "bg-chatred" : "bg-gray-500"} p-2 rounded-lg`}>
                    {message ? <p className="text-white">{message}</p> : <img src={fileUrl}></img>}
                </div>
            </div>
            <p className={`${isSender ? "ml-auto text-chatred" : "text-gray-500"}`}>{ timestamp }</p>
        </div>
    );
}