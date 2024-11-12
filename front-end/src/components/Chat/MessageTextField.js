import { FaArrowCircleUp } from "react-icons/fa";
import { AiFillPlusCircle } from "react-icons/ai";

export default function MessageTextField({ setSentMessage, sentMessage, sendMessage, onUploadClick }) {
    return (
        <div className="px-10 py-6 md:py-4 w-full rounded-b-xl flex flex-row justify-between">
            <button className="border-2 rounded-xl px-4 hover:border-neutral-500 duration-200" onClick={onUploadClick}>
                <AiFillPlusCircle className="text-3xl text-neutral-400 hover:text-neutral-500" />
            </button>
            <input 
                className="p-3 border-2 w-full rounded-xl outline-none mx-5"
                placeholder="Enter a Message.."
                value={sentMessage}
                onChange={(e) => setSentMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(null)}
            />
            <button className="border-2 rounded-xl px-4 hover:border-neutral-500 duration-200" onClick={() => sendMessage(null)}>
                <FaArrowCircleUp className="text-2xl text-neutral-400 hover:text-neutral-500" />
            </button>
        </div>
    );
}