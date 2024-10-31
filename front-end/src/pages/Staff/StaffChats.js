import { socket } from "../../utils/chatSocket"
import { useState, useEffect } from "react";
import * as CryptoJS from 'crypto-js';
import { useNavigate } from "react-router-dom";

// Components
import { FaArrowCircleUp } from "react-icons/fa";
import AwaitChatContainer from "../../components/Chat/AwaitingChatContainer";
import StaffNavigationBar from "../../components/StaffNavbar";
import MessageContainer from "../../components/Chat/MessageContainer";

export default function StaffChats() {
    const navigate = useNavigate();

    // Page Management
    const [displayAwaitCustomerList, setDisplayAwaitCustomerList] = useState(false);

    // State for Chats
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [waitingCustomers, setWaitingCustomers] = useState([]);
    const [connectedChats, setConnectedChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [sentMessage, setSentMessage] = useState("");

    // Setter Functions
    const joinChat = async (csi) => {    
        if (connectedChats.length >= 7) {
            return false; // Exit early if max chat limit is reached
        }
    
        try {
            const response = await new Promise((resolve, reject) => {
                socket.emit("staff:join", csi, sessionStorage.getItem('staffSessionIdentifier'), (response) => {
                    response.status === "Success" ? resolve(response) : reject(new Error("Failed to Join Chat"));
                });
            });
    
            const formattedChat = {
                ...response.chat,
                messages: []
            };
    
            setConnectedChats((prev) => [...prev, formattedChat]);
            saveConnectedChats(connectedChats);
    
            if (selectedChatId === null) {
                setSelectedChatId(formattedChat.caseId);
            }
    
            return true;
    
        } catch (err) {
            console.error(err);
            return false;
        }
    };
    

    const saveConnectedChats = (connectedChats) => {
        sessionStorage.setItem('connectedChats', JSON.stringify(connectedChats));
    }

    const showAwaitCustomerList = () => {
        socket.emit("staff:avail-chats");
        setDisplayAwaitCustomerList(true);
    }

    const sendMessage = () => {
        const formattedMsg = {
            case: connectedChats.filter((chat) => chat.caseId === selectedChatId)[0].caseId,
            message: sentMessage,
            timestamp: Date.now(),
            sender: "staff",
            sessionIdentifier: sessionStorage.getItem("staffSessionIdentifier"),
        }
        socket.emit("utils:send-msg", formattedMsg);
        setSentMessage("");
    }

    const handleEndChat = () => {
        // TODO: Proper Implementation
        
        // Remove from backend
        socket.emit("staff:end-chat", selectedChatId);

        // If the chat is the selected chat, remove the selected chat
        setSelectedChatId(null);

        // Remove the chat from session storage / state
        setConnectedChats((prevChats) => {
            const updatedChats = prevChats.filter((chat) => chat.caseId !== selectedChatId);
            saveConnectedChats(updatedChats);
            return updatedChats;
        });
    }

    useEffect(() => {
        // Generate a Unique Identifier for this Staff Session
        const staffSessionIdentifier = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
        sessionStorage.setItem('staffSessionIdentifier', staffSessionIdentifier);
        
        const handleConnection = () => {
            setIsConnected(true);

            socket.emit('staff:avail', staffSessionIdentifier);            
        }
        
        const handleDisconnection = () => {
            setIsConnected(false);
        }

        socket.on("connect", handleConnection);
        socket.on("disconnect", handleDisconnection);
        socket.on("staff:avail-chats", (waitingCustomers) => {
            setWaitingCustomers(waitingCustomers);
        })
        socket.on("utils:receive-msg", (msg) => {
            setConnectedChats((prevChats) => {
                const updatedChats = prevChats.map((chat) => {
                    if (chat.caseId === msg.case) {
                        return {
                            ...chat,
                            messages: [...chat.messages, msg],
                        };
                    }
                    return chat;
                });
                
                saveConnectedChats(updatedChats);
                return updatedChats; 
            });
        });       

        // Check for Past Data, if exists, load
        const pastConnectedChats = JSON.parse(sessionStorage.getItem('connectedChats'));
        if (pastConnectedChats) setConnectedChats(pastConnectedChats);
        
        return () => {
            socket.off("connect", handleConnection);
            socket.off("disconnect", handleDisconnection);
        }
    }, [])

    return (
        <div className="h-screen flex flex-col">
            <StaffNavigationBar />
            <div className="w-full bg-ocbcred text-white py-3 px-5">
                <h1 className="text-2xl font-semibold">OCBC Support  |  Live Chats</h1>
            </div>

            <div className="flex flex-row flex-grow">
                {/* Active Chat List */}
                <div id="chat-list" className="w-1/3 md:w-1/4 bg-neutral-100 border-r-2 border-neutral-600">
                    <div>

                    </div>
                    <div className="text-center py-4 border-y border-black cursor-pointer" onClick={() => showAwaitCustomerList()}>
                        <p className="font-semibold">Find and Start Live Chat</p>
                    </div>

                    <div id="chats" className="">
                        {connectedChats.map((chat) => (
                            <ChatListItem key={chat.caseId} chat={chat} selectedChatId={selectedChatId} setSelectedChatId={(id) => {
                                setSentMessage("");
                                setSelectedChatId(id)
                            }} />
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div id="chat-window" className={`flex flex-col flex-grow ${connectedChats.length === 0 && "items-center justify-center"}`}>
                    <div id="chat-header" className={`w-full bg-neutral-100 border-y-2 border-neutral-600 flex flex-row px-4 py-2 ${selectedChatId == null ? "hidden" : ""}`}>
                        {selectedChatId && connectedChats.filter((chat) => chat.caseId === selectedChatId).map((selectedChat => (
                            <>
                                <div>
                                    <p className="text-lg font-bold mb-0">{ selectedChat.customer?.faqQuestion }</p>
                                    <p className="text-neutral-500 text-sm">Case ID: { selectedChat.caseId }{ selectedChat.customer?.userId && " | Logged In" }</p>
                                </div>

                                <button className="ml-auto px-4 py-1 bg-ocbcred hover:bg-ocbcdarkred text-white rounded-lg" onClick={handleEndChat}>
                                    End Chat
                                </button>
                            </>
                        )))}
                    </div>

                    <div id="chat" className={`w-full flex-grow flex flex-col ${selectedChatId == null ? "hidden" : ""}`}>
                        <div id="chat-container" className="flex-grow p-10">
                            {selectedChatId && 
                            connectedChats
                                .filter((chat) => chat.caseId === selectedChatId)
                                .map((selectedChat) => (
                                    selectedChat.messages.map((msg) => (
                                        <MessageContainer key={msg.timestamp} isSender={msg.sender === "staff"} messages={[msg.message]} timestamp={msg.timestamp} />
                                    ))
                                ))
                            }
                        </div>

                        {/* Message Field */}
                        <div className="p-10 px-10 py-6 md:py-4 w-full rounded-b-xl flex flex-row justify-between">
                            <input 
                                className="p-3 border-2 w-full rounded-xl outline-none mr-5"
                                placeholder="Enter a Message.."
                                value={sentMessage}
                                onChange={(e) => setSentMessage(e.target.value) }
                            />
                            <button className="border-2 rounded-xl px-4 hover:border-neutral-500 duration-200" onClick={sendMessage}>
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
        </div>
    )
}

function ChatListItem({ chat, selectedChatId, setSelectedChatId }) {
    const handleOnClick = () => {
        setSelectedChatId(chat.caseId);
    }
    const getLastSentText = (messages) => {
        if (messages.length === 0) return {
            text: "",
            timestamp: "",
            isSender: false,
        }
        return {
            text: messages[messages.length - 1].text,
            timestamp: messages[messages.length - 1].timestamp,
            isSender: messages[messages.length - 1].sender === "staff",
        }
    }

    if (!chat.customer) return <></>

    return (
        <div className={`border-y-2 border-neutral-600 px-5 py-2 flex flex-row gap-5 max-w-full hover:bg-neutral-200 ${(selectedChatId === chat.caseId && (selectedChatId !== undefined && selectedChatId !== null)) && "bg-chatred/20"}`} onClick={handleOnClick}>
            <div className="min-w-0">
                <p className="truncate font-semibold">{ chat.customer.faqQuestion }</p>
                <p className="truncate">{ getLastSentText(chat.messages).text }</p>
            </div>
            <a className="flex-shrink-0">{ getLastSentText(chat.messages).timestamp }</a>
        </div>
    )
}