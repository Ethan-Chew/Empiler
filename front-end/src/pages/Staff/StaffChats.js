import { socket } from "../../utils/chatSocket"
import { useState, useEffect } from "react";
import handleFileUpload from "../../utils/handleFileUpload";
import { formatTimestamp } from "../../utils/formatTimestamp";

// Components
import { FaArrowCircleUp } from "react-icons/fa";
import { AiFillPlusCircle } from "react-icons/ai";
import AwaitChatContainer from "../../components/Chat/AwaitingChatContainer";
import StaffNavigationBar from "../../components/StaffNavbar";
import MessageContainer from "../../components/Chat/MessageContainer";
import ToastMessage from "../../components/ToastMessage";

export default function StaffChats() {
    // Page Management
    const [displayAwaitCustomerList, setDisplayAwaitCustomerList] = useState(false);

    // State for Chats
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [waitingCustomers, setWaitingCustomers] = useState([]);
    const [connectedChats, setConnectedChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [sentMessage, setSentMessage] = useState("");
    const [disconnectedChats, setDisconnectedChats] = useState([]);
    const [toastVisiblities, setToastVisibilities] = useState([]);

    // Setter Functions
    const joinChat = async (customerSessionIdentifier) => {    
        if (connectedChats.length >= 5) {
            return false; // Exit early if max chat limit is reached
        }
    
        try {
            const response = await new Promise((resolve, reject) => {
                socket.emit("staff:join", customerSessionIdentifier, (response) => {
                    response.status === "Success" ? resolve(response) : reject(new Error("Failed to Join Chat"));
                });
            });

            const formattedChat = {
                ...response.chat,
                messages: []
            };
    
            setConnectedChats((prev) => [...prev, formattedChat]);

            if (selectedChatId === null) {
                setSelectedChatId(formattedChat.caseID);
            }
    
            return true;
    
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const showAwaitCustomerList = () => {
        socket.emit("staff:avail-chats");
        setDisplayAwaitCustomerList(true);
    }

    const sendMessage = (fileUrl) => {
        if (sentMessage === "" && fileUrl === null) return;
        const formattedMsg = {
            case: connectedChats.filter((chat) => chat.caseID === selectedChatId)[0].caseID,
            message: fileUrl ? "" : sentMessage,
            fileUrl: fileUrl ? fileUrl : null,
            timestamp: Date.now(),
            sender: "staff",
        }
        socket.emit("utils:send-msg", formattedMsg);
        setSentMessage("");
    }

    const handleEndChat = () => {        
        // Remove from backend
        socket.emit("utils:end-chat", selectedChatId);

        // If the chat is the selected chat, remove the selected chat
        setSelectedChatId(null);

        // Remove the chat from session storage / state
        setConnectedChats((prevChats) => {
            const updatedChats = prevChats.filter((chat) => chat.caseID !== selectedChatId);
            return updatedChats;
        });
    }

    const handleHideToastMsg = (index) => {
        setToastVisibilities((prev) => {
            const updated = prev.map((toast, i) => {
                if (i === index) {
                    return false;
                }
                return toast;
            });
            return updated;
        });
    }

    useEffect(() => {  
        const handleConnection = () => {
            setIsConnected(true);
            socket.emit('staff:avail'); 
        }
        
        const handleDisconnection = () => {
            setIsConnected(false);
        }

        const handleReceiveMessage = (msg) => {
            setConnectedChats((prevChats) => {
                const updatedChats = prevChats.map((chat) => {
                    if (chat.caseID === msg.case) {
                        return {
                            ...chat,
                            messages: [...chat.messages, msg],
                        };
                    }
                    return chat;
                });
                
                return updatedChats; 
            });
        }

        const handleSetWaitingCustomers = (waitingCustomers) => {
            setWaitingCustomers(waitingCustomers);
        }

        const handleChatEnded = (caseID) => {
            if (selectedChatId === caseID) {
                setSelectedChatId(null);
            }

            setConnectedChats((prevChats) => {
                setDisconnectedChats((prevDisconChats) => [...prevDisconChats, prevChats.filter((chat) => chat.caseID === caseID)[0]]);
                setToastVisibilities((prev) => [...prev, true]);

                const updatedChats = prevChats.filter((chat) => chat.caseID !== caseID);
                return updatedChats;
            });
        }

        const handleReconnectAddChats = (chats) => {
            setConnectedChats(chats);
            socket.emit("utils:add-socket", null, "staff");
        }

        // Handle Event Listeners
        socket.on("connect", handleConnection);
        socket.on("disconnect", handleDisconnection);
        socket.on("staff:avail-chats", handleSetWaitingCustomers)
        socket.on("utils:receive-msg", handleReceiveMessage);
        socket.on("utils:chat-ended", handleChatEnded);
        socket.on("staff:active-chats", handleReconnectAddChats);
        
        return () => {
            // Clear Event Listeners on Deconstructor
            socket.off("connect", handleConnection);
            socket.off("disconnect", handleDisconnection);
            socket.off("staff:avail-chats", handleSetWaitingCustomers)
            socket.off("utils:receive-msg", handleReceiveMessage);
            socket.off("utils:chat-ended", handleChatEnded);
            socket.off("staff:active-chats", handleReconnectAddChats);
        }
    }, []);

    useEffect(() => {
        // Retrieve Active Chats, if exists, load it
        socket.emit("staff:active-chats");
    }, [isConnected])

    async function onUploadClick() {
        try {
            const fileUrl = await handleFileUpload(selectedChatId);
            
            sendMessage(fileUrl);
        } catch (err) {
            console.error('Error during file upload:', err);
        }
    }

    return (
        <div className="max-h-screen h-screen flex flex-col">
            <StaffNavigationBar />
            <div className="w-full bg-ocbcred text-white py-3 px-5">
                <h1 className="text-2xl font-semibold">OCBC Support  |  Live Chats</h1>
            </div>

            <div className="flex flex-row flex-1">
                {/* Active Chat List */}
                <div id="chat-list" className="w-1/3 md:w-1/4 bg-neutral-100 border-r border-gray-300 overflow-y-auto">
                    <div>

                    </div>
                    <div className="text-center py-4 border-y border-gray-300 cursor-pointer" onClick={() => showAwaitCustomerList()}>
                        <p className="font-semibold">Find and Start Live Chat</p>
                    </div>

                    <div id="chats" className="">
                        {connectedChats.map((chat) => (
                            <>
                                <ChatListItem key={chat.caseID} chat={chat} selectedChatId={selectedChatId} setSelectedChatId={(id) => {
                                    setSentMessage("");
                                    setSelectedChatId(id)
                                }} />
                            </>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div id="chat-window" className={`flex flex-col flex-grow ${connectedChats.length === 0 && "items-center justify-center"} overflow-hidden`}>
                    <div id="chat-header" className={`${!selectedChatId ? "hidden" : ""} w-full bg-neutral-100 border-y border-gray-300 flex flex-row px-4 py-2`}>
                        {selectedChatId && connectedChats.filter((chat) => chat.caseID === selectedChatId).map((selectedChat => (
                            <>
                                <div>
                                    <p className="text-lg font-bold mb-0">{ selectedChat.customer?.faqQuestion }</p>
                                    <p className="text-neutral-500 text-sm">Case ID: { selectedChat.caseID }{ selectedChat.customer?.userID && " | Logged In" }</p>
                                </div>

                                <button className="ml-auto px-4 py-1 bg-ocbcred hover:bg-ocbcdarkred text-white rounded-lg" onClick={handleEndChat}>
                                    End Chat
                                </button>
                            </>
                        )))}
                    </div>

                    <div id="chat" className={`w-full flex-grow flex flex-col ${selectedChatId === null ? "hidden" : ""}`}>
                        <div id="chat-container" className="flex-grow p-4 overflow-y-auto max-h-[calc(100vh-18rem)]">
                            {selectedChatId && 
                            connectedChats
                                .filter((chat) => chat.caseID === selectedChatId)
                                .map((selectedChat) => (
                                    selectedChat.messages.map((msg) => (
                                        <MessageContainer key={msg.timestamp} isSender={msg.sender === "staff"} message={msg.message || null} fileUrl={msg.fileUrl || null} timestamp={msg.timestamp} />
                                    ))
                                ))
                            }
                        </div>

                        {/* Message Field */}
                        <div className="p-10 px-10 py-6 md:py-4 w-full rounded-b-xl flex flex-row justify-between">
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
                    </div>
                    
                    {/* Displayed when the Staff has not picked up any Live Chats */}
                    <div id="no-active-chats" className={`${connectedChats.length !== 0 && "hidden"} m-5 sm:m-0 p-5 rounded-xl bg-white drop-shadow-[0_0px_4px_rgba(0,0,0,.3)] flex flex-col items-center justify-center text-center`}>
                        <h3 className="text-xl font-semibold mb-3">You have no active Live Chats!</h3>
                        <button
                            className="px-4 py-2 bg-ocbcred hover:bg-ocbcdarkred text-white rounded-xl"
                            onClick={() => showAwaitCustomerList()}
                        >
                            Join Live Chat
                        </button>
                    </div>
                </div>
            </div>

            {displayAwaitCustomerList && (
                <div
                    className="fixed top-0 left-0 h-screen w-screen bg-neutral-900/20 backdrop-blur-sm flex items-center justify-center duration-200 z-10"
                >
                    <AwaitChatContainer
                        joinChat={joinChat}
                        hideAwaitCustomerList={() => setDisplayAwaitCustomerList(false)}
                        waitingCustomers={waitingCustomers}
                    />
                </div>
            )}

            {/* Handle Disconnect Messages */}
            <div className="fixed bottom-5 left-5">
                {disconnectedChats.map((chat, index) => (
                    toastVisiblities[index] && <ToastMessage key={index} index={index} message={`Customer with Case ID: ${chat.caseID} has left the chat`} isShown={toastVisiblities[index]} hideToast={handleHideToastMsg} />
                ))}
            </div>
        </div>
    )
}

function ChatListItem({ chat, selectedChatId, setSelectedChatId }) {
    const handleOnClick = () => {
        setSelectedChatId(chat.caseID);
    }
    const getLastSentText = (messages) => {
        if (messages.length === 0) return {
            message: "",
            timestamp: "",
            isSender: false,
        }

        return {
            message: messages[messages.length - 1].message || "Sent an Image",
            timestamp: messages[messages.length - 1].timestamp,
            isSender: messages[messages.length - 1].sender === "staff",
        }
    }

    if (!chat.customer) return <></>

    return (
        <div
            className={`border-y border-gray-300 px-5 py-2 flex flex-row gap-5 max-w-full hover:bg-neutral-200 ${(selectedChatId === chat.caseID && (selectedChatId !== undefined && selectedChatId !== null)) && "bg-chatred/20"}`}
            onClick={handleOnClick}
        >
            {selectedChatId === chat.caseID && (
                <div className="w-2 bg-gray-400 -ml-5 -my-2"></div>
            )}
            <div className="min-w-0 flex-grow">
                <p className="truncate font-semibold">{chat.customer.faqQuestion}</p>
                <p className="truncate">{getLastSentText(chat.messages).message}</p>
            </div>
            {getLastSentText(chat.messages).timestamp ? <a className="flex-shrink-0">{formatTimestamp(getLastSentText(chat.messages).timestamp)}</a> : null}
        </div>
    )
}