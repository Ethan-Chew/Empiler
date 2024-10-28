import NavigationBar from "../../components/Navbar";
import MessageContainer from "../../components/Chat/MessageContainer";
import { socket } from "../../utils/chatSocket";
import { useSearchParams } from "react-router-dom";
import { FaArrowCircleUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function CustomerChat() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();  
    const [messages, setMessages] = useState([]);
    const [sentMessage, setSentMessage] = useState("");
    const caseID = searchParams.get("caseID");

    useEffect(() => {
        // If there is no Case ID, redirect the Customer back to the Landing Page
        if (!caseID) {
            navigate("/");
        }

        // Socket.IO Event Handlers
        const handleDisconnection = () => {

        }

        const handleReceiveMessage = (msg) => {
            
        }

        socket.on("disconnect", handleDisconnection);
        socket.on("utils:receiveMsg")

        return () => {
            socket.off("disconnect", handleDisconnection);
        }
    }, []);

    function sendMessage() {

    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavigationBar />

            <div className="flex-grow flex flex-col p-0 md:p-10">
                {/* Live Chat Info Window */}
                <div id="support-header" className="w-full p-6 md:p-4 rounded-xl flex flex-row bg-white md:drop-shadow-[0_0px_4px_rgba(0,0,0,.3)]">
                    <div className="flex flex-col">
                        <a className="text-lg font-bold">You are now connected to our Customer Support Representative.</a>
                        <a className="text-sm text-neutral-400">Case ID: { caseID }</a>
                    </div>

                    <button className="ml-auto">
                        End Chat
                    </button>
                </div>

                {/* Live Chat Container */}
                <div id="live-chat" className="flex-grow md:mt-10 h-full w-full rounded-xl flex flex-col bg-white md:drop-shadow-[0_0px_4px_rgba(0,0,0,.3)]">
                    <div className="flex-grow p-6 md:p-4">
                        <a>You are now chatting with [insert name].</a>
                        
                        {/* Messages Area */}
                        <div id="chat-messages" className="h-full my-4">
                            <MessageContainer 
                                isSender={true}
                                messages={["hi u", "hihihi"]}
                                timestamp="12:00 PM"
                            />
                            <MessageContainer 
                                isSender={false}
                                messages={["Hello! How can I help you today?"]}
                                timestamp="12:00 PM"
                            />
                        </div>
                    </div>

                    {/* Message Field */}
                    <div className="px-10 py-6 md:py-4 w-full rounded-b-xl flex flex-row justify-between">
                        <input 
                            className="p-3 border-2 w-full rounded-xl outline-none mr-5"
                            placeholder="Enter a Message.."
                            onChange={(e) => setSentMessage(e.target.value)}
                        />
                        <button className="border-2 rounded-xl px-4 hover:border-neutral-500 duration-200">
                            <FaArrowCircleUp className="text-2xl text-neutral-400 hover:text-neutral-500" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}