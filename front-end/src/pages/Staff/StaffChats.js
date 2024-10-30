import { socket } from "../../utils/chatSocket"
import { useState, useEffect } from "react";
import * as CryptoJS from 'crypto-js';
import { useNavigate } from "react-router-dom";
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

    const addConnectedChat = async (chat) => {
        if (connectedChats.length < 7) {
            // Send a request to the server to start the Live Chat between the Staff and the Customer
            await new Promise(resolve => {
                socket.emit("staff:join", chat.customerSessionIdentifier, sessionStorage.getItem('staffSessionIdentifier'), (response) => {
                    
                    resolve();
                });
            });

            setConnectedChats(prev => [...prev, chat]);

            return true;
        }
        return false;
    }

    const hideAwaitCustomerList = () => {
        setDisplayAwaitCustomerList(false);
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
        <div className="min-h-screen h-screen">
            <StaffNavigationBar />
            <div className="w-full bg-ocbcred text-white py-3 px-5">
                <h1 className="text-2xl font-semibold">OCBC Support  |  Live Chats</h1>
            </div>

            <div className="flex flex-row h-full">
                {/* Active Chat List */}
                <div id="chat-list" className="w-1/4 bg-neutral-100 border-r-2 border-neutral-600">
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
                    <div className={`p-5 rounded-xl bg-white md:drop-shadow-[0_0px_4px_rgba(0,0,0,.3)] ${connectedChats.length !== 0 && "hidden"} flex flex-col items-center justify-center`}>
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
                <AwaitChatContainer addConnectedChat={addConnectedChat} hideAwaitCustomerList={hideAwaitCustomerList} />
            </div>
        </div>
    )
}

function ChatListItem({ chat }) {
    return (
        <div>

        </div>
    )
}