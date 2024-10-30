import { socket } from "../../utils/chatSocket"
import { useState, useEffect } from "react";
import * as CryptoJS from 'crypto-js';
import { useNavigate } from "react-router-dom";

// Components
import { FaArrowCircleUp } from "react-icons/fa";
import AwaitChatContainer from "../../components/Chat/AwaitingChatContainer";
import StaffNavigationBar from "../../components/StaffNavbar";

export default function StaffChats() {
    const navigate = useNavigate();

    // Page Management
    const [displayAwaitCustomerList, setDisplayAwaitCustomerList] = useState(false);

    // State for Chats
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [waitingCustomers, setWaitingCustomers] = useState([]);
    const [connectedChats, setConnectedChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [sentMessage, setSentMessage] = useState("");

    // Setter Functions
    const addConnectedChat = async (chat) => {
        if (connectedChats.length < 7) {
            // Send a request to the server to start the Live Chat between the Staff and the Customer
            await new Promise((resolve, reject) => {
                socket.emit("staff:join", chat.customerSessionIdentifier, sessionStorage.getItem('staffSessionIdentifier'), (response) => {
                    if (response.status === "Success") resolve();
                    else reject(new Error("Failed to Join Chat"));
                });
            }).catch((err) => {
                console.error(err);
                return false;
            });
            const formattedChat = {
                ...chat,
                "messages": []
            }

            setConnectedChats(prev => [...prev, formattedChat]);

            return true;
        }
        return false;
    }

    const hideAwaitCustomerList = () => {
        setDisplayAwaitCustomerList(false);
    }

    const selectChat = (chat) => {
        setSelectedChat(chat);
    }

    useEffect(() => {
        // Generate a Unique Identifier for this Staff Session
        const staffSessionIdentifier = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
        sessionStorage.setItem('staffSessionIdentifier', staffSessionIdentifier);
        
        const handleConnection = () => {
            setIsConnected(true);
            console.log("connected")

            socket.emit('staff:avail', staffSessionIdentifier);            
        }
        
        const handleDisconnection = () => {
            setIsConnected(false);
        }

        socket.on("connect", handleConnection);
        socket.on("disconnect", handleDisconnection);
        socket.on("staff:avail-chats", (waitingCustomers) => {
            console.log(waitingCustomers)
            setWaitingCustomers(waitingCustomers);
        })

        return () => {
            socket.off("connect", handleConnection);
            socket.off("disconnect", handleDisconnection);
        }
    }, [])

    const joinChat = (csi) => {
        socket.emit("staff:join", csi, sessionStorage.getItem('staffSessionIdentifier'), (response) => {
            if (response.status === "Success") {
                console.log("Joined Chat Successfully");
                navigate(`/staff/chats/${response.caseId}`);
            } else {
                console.log("Failed to Join Chat");
            }
        });
    }

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
                    <div className="text-center py-4 border-y border-black cursor-pointer" onClick={() => setDisplayAwaitCustomerList(true)}>
                        <p className="font-semibold">Find and Start Live Chat</p>
                    </div>

                    <div id="chats" className="">
                        {connectedChats.map((chat) => (
                            <ChatListItem key={chat.caseId} chat={chat} />
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div id="chat-window" className={`flex flex-col flex-grow ${connectedChats.length === 0 && "items-center justify-center"}`}>
                    {/* Main Chat Container; Hidden when the user has no Live Chats */}
                    <div className={`${connectedChats.length === 0 && "hidden"}`}>
                        <div id="chat-header" className="w-full bg-neutral-100 border-y-2 border-neutral-600 flex flex-row px-4 py-2">
                            {selectedChat && (
                                <div>
                                    <p className="text-lg font-bold mb-0">{ selectedChat.customer?.faqQuestion }</p>
                                    <p className="text-neutral-500 text-sm">Case ID: { selectedChat.caseId }{ selectedChat.customer?.userId && " | Logged In" }</p>
                                </div>
                            )}
                            <button className="ml-auto px-4 py-1 bg-ocbcred hover:bg-ocbcdarkred text-white rounded-lg">
                                End Chat
                            </button>
                        </div>

                        <div id="chat" className="w-full flex-grow flex flex-col">
                            <div id="chat-container" className="flex-grow">

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
                    
                    {/* Displayed when the Staff has not picked up any Live Chats */}
                    <div id="no-active-chats" className={`${connectedChats.length !== 0 && "hidden"} m-5 sm:m-0 p-5 rounded-xl bg-white drop-shadow-[0_0px_4px_rgba(0,0,0,.3)] flex flex-col items-center justify-center text-center`}>
                        <h3 className="text-xl font-semibold mb-3">You have no active Live Chats!</h3>
                        <button
                            className="px-4 py-2 bg-ocbcred hover:bg-ocbcdarkred text-white rounded-xl"
                            onClick={() => setDisplayAwaitCustomerList(true)}
                        >
                            Join Live Chat
                        </button>
                    </div>
                </div>
            </div>


            <div className={`${displayAwaitCustomerList ? "block opacity-100" : "hidden opacity-0"} duration-200`}>
                <AwaitChatContainer addConnectedChat={addConnectedChat} hideAwaitCustomerList={hideAwaitCustomerList} waitingCustomers={waitingCustomers} />
            </div>
        </div>
    )
}

function ChatListItem({ chat, selectedChat, setSelectedChat }) {
    const handleOnClick = () => {
        setSelectedChat(chat);
    }
    const getLastSentText = (messages) => {
        return {
            text: messages[messages.length - 1].text,
            timestamp: messages[messages.length - 1].timestamp,
            isSender: messages[messages.length - 1].sender === "staff",
        }
    }

    return (
        <div className={`border-y-2 border-neutral-600 px-5 py-2 flex flex-row gap-5 max-w-full hover:bg-neutral-200 ${(selectedChat === chat && (selectedChat !== undefined && selectedChat !== null)) && "bg-chatred/20"}`} onClick={handleOnClick}>
            <div className="min-w-0">
                <p className="truncate font-semibold">{ chat.customer.faqQuestion }</p>
                <p className="truncate">{ getLastSentText(chat.messages).text }</p>
            </div>
            <a className="flex-shrink-0">{ getLastSentText(chat.messages).timestamp }</a>
        </div>
    )
}