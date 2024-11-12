import NavigationBar from "../../components/Navbar";
import MessageContainer from "../../components/Chat/MessageContainer";
import handleFileUpload from "../../utils/handleFileUpload";
import { socket } from "../../utils/chatSocket";

import { useSearchParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import MessageTextField from "../../components/Chat/MessageTextField";

export default function CustomerChat() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isConnected, setIsConnected] = useState(false);
    const [searchParams] = useSearchParams();
    const caseID = searchParams.get("caseID");

    const [messages, setMessages] = useState([]);
    const [chatEnded, setChatEnded] = useState(false);
    const [sentMessage, setSentMessage] = useState("");
    const [staffName, setStaffName] = useState("[insert name]");

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
                socket.emit("utils:end-chat", caseID, true);
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

        // Retrieve the Staff Name from the Location State
        if (location.state && "staffName" in location.state) {
            setStaffName(location.state.staffName);
        }

        // Socket.IO Event Handlers
        const handleConnection = () => {
            setIsConnected(true);
            
            const customerSessionIdentifier = sessionStorage.getItem("customerSessionIdentifier");
            if (!customerSessionIdentifier) {
                navigateHome();
            }

            socket.emit("utils:verify-activechat", customerSessionIdentifier, (chatExistanceReq) => {
                setStaffName(chatExistanceReq.staffName);
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
            socket.off("connect", handleConnection);
            socket.off("disconnect", handleDisconnection);
            socket.off("utils:receive-msg", handleReceiveMessage);
            socket.off("utils:chat-ended", handleChatClosure);
        }
    }, []);

    function sendMessage(fileUrl) {
        if (sentMessage === "" && fileUrl === null) return;
        const formattedMsg = {
            case: caseID,
            message: fileUrl ? "" : sentMessage,
            fileUrl: fileUrl ? fileUrl : null,
            timestamp: Date.now(),
            sender: "customer",
            sessionIdentifier: sessionStorage.getItem("customerSessionIdentifier"),
        }

        socket.emit("utils:send-msg", formattedMsg);
        setSentMessage("");
    }

    async function onUploadClick() {
        try {
            const fileUrl = await handleFileUpload(caseID);

            sendMessage(fileUrl);
        } catch (err) {
            console.error('Error during file upload:', err);
        }
    }

    function handleEndChat() {
        socket.emit("utils:end-chat", caseID, false);
        navigateRating();
    }

    function navigateHome() {
        navigate("/");
        sessionStorage.removeItem("customerSessionIdentifier");
    }

    function navigateRating() {
        navigate("/chat/rating", { state: { caseID: caseID, staffName: staffName } });
        sessionStorage.removeItem("customerSessionIdentifier");
    }

    return (
        <div className="flex flex-col min-h-screen max-h-screen">
            <NavigationBar />
            <div className="w-full bg-ocbcred text-white py-3 px-5">
                <h1 className="text-2xl font-semibold">OCBC Support  |  Live Chat</h1>
            </div>

            <div className="flex-grow flex flex-col p-0 md:p-10">
                {/* Live Chat Info Window */}
                <div id="support-header" className="w-full p-6 md:p-4 rounded-xl flex flex-row bg-white md:drop-shadow-[0_0px_4px_rgba(0,0,0,.3)]">
                    <div className="flex flex-col">
                        <a className="text-lg font-bold">You are now connected to our Customer Support Representative.</a>
                        <a className="text-sm text-neutral-400">Case ID: {caseID}</a>
                    </div>

                    <button className={`ml-auto px-4 py-1 bg-ocbcred hover:bg-ocbcdarkred text-white rounded-lg ${chatEnded && "cursor-not-allowed"}`} disabled={chatEnded} onClick={handleEndChat}>
                        End Chat
                    </button>
                </div>

                {/* Live Chat Container */}
                <div id="live-chat" className="flex-grow h-full md:mt-10 w-full rounded-xl flex flex-col bg-white md:drop-shadow-[0_0px_4px_rgba(0,0,0,.3)]">
                    <div className="flex-grow overflow-y-scroll p-6 md:p-4 min-h-0">
                        { staffName !== "[insert name]" ? <a>You are now chatting with {staffName}.</a> : <></>}
                        
                        {/* Messages Area */}
                        <div id="chat-messages" className=" my-4 min-h-0 flex-grow overflow-y-scroll max-h-[calc(100vh-30rem)]">
                            {messages.map((msg) => (
                                <MessageContainer key={msg.timestamp} isSender={msg.sender === "customer"} message={msg.message || null} fileUrl={msg.fileUrl || null} timestamp={msg.timestamp} socket={socket} />
                            ))}
                        </div>
                    </div>

                    {/* Message Field */}
                    {!chatEnded ? (
                        <MessageTextField setSentMessage={setSentMessage} sentMessage={sentMessage} sendMessage={sendMessage} onUploadClick={onUploadClick} socket={socket} />
                    ) : (
                        <div className="px-10 py-6 md:py-4 w-full rounded-b-xl flex flex-col items-center border-t-2">
                            <p className="font-semibold text-lg mb-3">The Customer Support Representative has ended the Live Chat. We hope your problem was resolved!</p>
                            <button className="px-4 py-2 bg-ocbcred hover:bg-ocbcdarkred rounded-lg text-white" onClick={navigateRating}>
                                Continue
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div id="inactivity-popup" className={`${userInactive ? "" : "hidden"} fixed top-0 left-0 h-screen w-screen bg-neutral-900/20 backdrop-blur-sm flex items-center justify-center duration-200 z-10`}>
                <div className="p-5 bg-white flex flex-col items-center justify-center">
                    <h2 className="font-semibold text-2xl mb-2">Looks like you've been inactive for awhile.</h2>
                    <p className="text-lg">{ userDisconnected ? "You have been disconnected from the Live Chat." : "Please interact with the window to continue." }</p>
                    <button className="mt-3 px-4 py-2 bg-ocbcred hover:bg-ocbcdarkred rounded-lg text-white" onClick={navigateRating}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}