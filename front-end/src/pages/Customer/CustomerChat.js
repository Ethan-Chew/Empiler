import NavigationBar from "../../components/Navbar";
import MessageContainer from "../../components/Chat/MessageContainer";
import { socket } from "../../utils/chatSocket";
import { useSearchParams } from "react-router-dom";
import { FaArrowCircleUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function CustomerChat() {
    const navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(false);
    const [isDisconnected, setIsDisconnected] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();  
    const [messages, setMessages] = useState([]);
    const [sentMessage, setSentMessage] = useState("");
    const [chatEnded, setChatEnded] = useState(false);
    const caseID = searchParams.get("caseID");

    // User Inactivity States
    const [inactivityTimer, setInactivityTimer] = useState(0);
    const [userInactive, setUserInactive] = useState(false);
    const [userDisconnected, setUserDisconnect] = useState(false);
    const inactivityLimit = 3;
    const disconnectLimit = 4;

    // Helper Function to handle Window's Visibility Change. When inactive for 3 minutes, show warning. When inactive for 4 minutes, disconnect
    useEffect(() => {
        const handleUserActivity = () => {
            setInactivityTimer(0);
            setUserInactive(false);
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                setInactivityTimer(0);
                setUserInactive(false);
            }
        }

        // Increment inactivity time every minute
        const interval = setInterval(() => {
            setInactivityTimer(prev => prev + 1);

            if (inactivityTimer >= inactivityLimit) {
                setUserInactive(true);
            }

            if (inactivityTimer >= disconnectLimit) {
                setUserDisconnect(true);
                socket.emit("utils:disconnect", sessionStorage.getItem("customerSessionIdentifier"));
            }
        }, 60000);

        // Set up event listeners
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keypress', handleUserActivity);
        window.addEventListener('click', handleUserActivity);
        window.addEventListener('touchstart', handleUserActivity);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keypress', handleUserActivity);
            window.removeEventListener('click', handleUserActivity);
            window.removeEventListener('touchstart', handleUserActivity);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(interval);
        };
    }, [inactivityTimer]);

    useEffect(() => {
        // If there is no Case ID, redirect the Customer back to the Landing Page
        if (!caseID) {
            navigateHome();
        }

        // Socket.IO Event Handlers
        const handleConnection = () => {
            setIsConnected(true);
            
            const customerSessionIdentifier = sessionStorage.getItem("customerSessionIdentifier");
            if (!customerSessionIdentifier) {
                navigateHome();
            }

            socket.emit("utils:verify-activechat", customerSessionIdentifier, (chatExistanceReq) => {
                if (chatExistanceReq.exist && chatExistanceReq.caseID === caseID) {
                    socket.emit("utils:add-socket", customerSessionIdentifier, "customer");
                    setMessages(chatExistanceReq.chatHistory);
                } else {
                    navigateHome();
                }
            });
        }

        const handleDisconnection = () => {
            setIsConnected(false);
        }

        const handleReceiveMessage = (msg) => {
            setMessages(prev => [...prev, msg]);
        }

        const handleChatClosure = () => {
            setChatEnded(true);
            sessionStorage.removeItem("customerSessionIdentifier");
        }

        socket.on("connect", handleConnection);
        socket.on("disconnect", handleDisconnection);
        socket.on("utils:receive-msg", handleReceiveMessage);
        socket.on("utils:chat-ended", handleChatClosure);

        return () => {
            socket.off("disconnect", handleDisconnection);
        }
    }, []);

    function sendMessage() {
        const formattedMsg = {
            case: caseID,
            message: sentMessage,
            timestamp: Date.now(),
            sender: "customer",
            sessionIdentifier: sessionStorage.getItem("customerSessionIdentifier"),
        }
        socket.emit("utils:send-msg", formattedMsg);
        setSentMessage("");
    }

    function handleEndChat() {
        socket.emit("utils:end-chat", caseID);
        setIsDisconnected(true);
    }

    function navigateHome() {
        navigate("/");
        sessionStorage.removeItem("customerSessionIdentifier");
    }

    return (
        <div className="flex flex-col min-h-screen max-h-screen">
            <NavigationBar />

            <div className="flex-grow flex flex-col p-0 md:p-10">
                {/* Live Chat Info Window */}
                <div id="support-header" className="w-full p-6 md:p-4 rounded-xl flex flex-row bg-white md:drop-shadow-[0_0px_4px_rgba(0,0,0,.3)]">
                    <div className="flex flex-col">
                        <a className="text-lg font-bold">You are now connected to our Customer Support Representative.</a>
                        <a className="text-sm text-neutral-400">Case ID: {caseID}</a>
                    </div>

                    <button className="ml-auto px-4 py-1 bg-ocbcred hover:bg-ocbcdarkred text-white rounded-lg" onClick={handleEndChat}>
                        End Chat
                    </button>
                </div>

                {/* Live Chat Container */}
                <div id="live-chat" className="flex-grow h-full md:mt-10 w-full rounded-xl flex flex-col bg-white md:drop-shadow-[0_0px_4px_rgba(0,0,0,.3)]">
                    <div className="flex-grow overflow-y-scroll p-6 md:p-4 min-h-0">
                        <a>You are now chatting with [insert name].</a>
                        
                        {/* Messages Area */}
                        <div id="chat-messages" className="overflow-y-scroll my-4 min-h-0">
                            {messages.map((msg) => (
                                <MessageContainer key={msg.timestamp} isSender={msg.sender === "customer"} messages={[msg.message]} timestamp={msg.timestamp} />
                            ))}
                        </div>
                    </div>

                    {/* Message Field */}
                    {!chatEnded ? (
                        <div className="px-10 py-6 md:py-4 w-full rounded-b-xl flex flex-row justify-between">
                            <input 
                                className="p-3 border-2 w-full rounded-xl outline-none mr-5"
                                placeholder="Enter a Message.."
                                value={sentMessage} // Bind input to `sentMessage`
                                onChange={(e) => setSentMessage(e.target.value)}
                            />
                            <button className="border-2 rounded-xl px-4 hover:border-neutral-500 duration-200" onClick={sendMessage}>
                                <FaArrowCircleUp className="text-2xl text-neutral-400 hover:text-neutral-500" />
                            </button>
                        </div>
                    ) : (
                        <div className="px-10 py-6 md:py-4 w-full rounded-b-xl flex flex-col items-center border-t-2">
                            <p className="font-semibold text-lg mb-3">The Customer Support Representative has ended the Live Chat. We hope your problem was resolved!</p>
                            <button className="px-4 py-2 bg-ocbcred hover:bg-ocbcdarkred rounded-lg text-white" onClick={navigateHome}>
                                Back to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div id="inactivity-popup" className={`${userInactive ? "" : "hidden"} fixed top-0 left-0 h-screen w-screen bg-neutral-900/20 backdrop-blur-sm flex items-center justify-center duration-200 z-10`}>
                <div className="p-5 bg-white flex flex-col items-center justify-center">
                    <h2 className="font-semibold text-2xl mb-2">Looks like you've been inactive for awhile.</h2>
                    <p className="text-lg">{ userDisconnected ? "You have been disconnected from the Live Chat." : "Please interact with the window to continue." }</p>
                </div>
            </div>

            <div id="disconnected-popup" className={`${isDisconnected ? "" : "hidden"} fixed top-0 left-0 h-screen w-screen bg-neutral-900/20 backdrop-blur-sm flex items-center justify-center duration-200 z-10`}>
                <div className="p-5 bg-white flex flex-col items-center justify-center">
                    <h2 className="font-semibold text-2xl mb-2">You have disconnected from the chat.</h2>
                    <button className="px-4 py-2 bg-ocbcred hover:bg-ocbcdarkred rounded-lg text-white" onClick={navigateHome}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}