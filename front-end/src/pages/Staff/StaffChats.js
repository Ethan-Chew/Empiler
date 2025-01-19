import { socket } from "../../utils/chatSocket"
import { useState, useEffect } from "react";
import handleFileUpload from "../../utils/handleFileUpload";
import { formatTimestamp } from "../../utils/formatTimestamp";
import { useNavigate } from 'react-router-dom';

// Components
import AwaitChatContainer from "../../components/Chat/AwaitingChatContainer";
import StaffNavigationBar from "../../components/StaffNavbar";
import MessageContainer from "../../components/Chat/MessageContainer";
import ToastMessage from "../../components/ToastMessage";
import MessageTextField from "../../components/Chat/MessageTextField";
import RSAHandler from "../../utils/KeyHandlers/RSAHandler";
import AESHandler from "../../utils/KeyHandlers/AESHandler";

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
    const [disconnectedChats, setDisconnectedChats] = useState([]);
    const [toastVisiblities, setToastVisibilities] = useState([]);

    // E2E Encryption Status
    const [ rsaPublicKeys, setRsaPublicKeys ] = useState([]);

    // Error
    const [ error, setError ] = useState({
        title: "Authentication",
        description: "An error occured with making a secure connection with the server.",
        isShown: true,
        type: "error"
    })

    // Setter Functions
    const joinChat = async (customerSessionIdentifier) => {    
        if (connectedChats.length >= 5) {
            return false; // Exit early if max chat limit is reached
        }
    
        try {
            const response = await new Promise((resolve, reject) => {
                socket.emit("staff:join", customerSessionIdentifier, (response) => {
                    response.status === "Success" ? resolve(response) : reject(new Error("Failed to Join Chat"));// Emit the User's RSA Public Key
                });
            });

            // Set a timer, and request every second if the RSA Public Key is not received
            let counter = 0;
            const interval = setInterval(() => {
                if (rsaPublicKeys.filter((key) => key.caseId === response.chat.caseID).length === 0) {
                    socket.emit("utils:request-public-key", response.chat.caseID);
                    counter++;
                } else {
                    clearInterval(interval);
                }

                if (counter >= 10) {
                    clearInterval(interval);
                }
            }, 2000);

            const formattedChat = {
                ...response.chat,
                messages: []
            };

            setConnectedChats((prev) => [...prev, formattedChat]);
            setSelectedChatId(formattedChat.caseID);
    
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

    const sendMessage = async (fileUrl) => {
        if (sentMessage === "" && fileUrl === null) return;
        
        const isFile = Boolean(fileUrl);
        const currentTimestamp = Date.now();

        const messageObject = {
            id: crypto.randomUUID(),
            case: connectedChats.filter((chat) => chat.caseID === selectedChatId)[0].caseID,
            message: isFile ? null : sentMessage,
            fileUrl: isFile ? fileUrl : null,
            timestamp: currentTimestamp,
            sender: "staff",
        }

        try {
            // Encrypt the message with the Customer's RSA Public Key
            const aesKey = await AESHandler.generateAESKey();

            // Save the AES Key, IV and ID to the IndexedDB
            await AESHandler.saveAESKeyWithMessageId(aesKey, messageObject.id);

            const customerRSAPublic = rsaPublicKeys.filter((key) => key.caseId === selectedChatId)[0].key;
            const encryptedMessage = await AESHandler.encryptDataWithAESKey(isFile ? fileUrl : sentMessage, aesKey);
            const encryptedKey = await RSAHandler.encryptDataWithRSAPublic(aesKey, customerRSAPublic);

            // Prepare the formatted message
            const encrypedMessageObject = JSON.parse(JSON.stringify(messageObject));
            encrypedMessageObject.message = isFile ? null : encryptedMessage.data;
            encrypedMessageObject.fileUrl = isFile ? encryptedMessage.data : null;
            encrypedMessageObject.key = encryptedKey;
            encrypedMessageObject.iv = encryptedMessage.iv;

            socket.emit("utils:send-msg", encrypedMessageObject);
            setSentMessage("");

            // Update Message Locally
            setConnectedChats((prevChats) => {
                const updatedChats = prevChats.map((chat) => {
                    if (chat.caseID === messageObject.case) {
                        return {
                            ...chat,
                            messages: [...chat.messages, messageObject],
                        };
                    }
                    return chat;
                });
                
                return updatedChats; 
            });
        } catch (err) {
            console.error('Error: ', err);
        }
    }

    const sendAppointment = () => {
        const formattedMsg = {
            case: connectedChats.filter((chat) => chat.caseID === selectedChatId)[0].caseID,
            message: "appointment",
            timestamp: Date.now(),
            sender: "staff",
        };
        socket.emit("utils:send-msg", formattedMsg);
        setSentMessage("");
    }

    const handleEndChat = () => {        
        // Remove from backend
        socket.emit("utils:end-chat", selectedChatId, false);

        // If the chat is the selected chat, remove the selected chat
        setSelectedChatId(null);

        // Already handled in the backend as on "disconnect"
        // Remove the chat from session storage / state
        setConnectedChats((prevChats) => {
            const updatedChats = prevChats.filter((chat) => chat.caseID !== selectedChatId);
            return updatedChats;
        });
        
        navigate("/staff/chats");
    }

    async function handleAppointmentClick() {
        try {
            sendAppointment();
        } catch (err) {
            console.error('Error: ', err);
        }
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
        // Generate RSA Key Pair for the Staff
        RSAHandler.generateRSAKeyPair();

        const handleConnection = (params) => {
            setIsConnected(true);
            socket.emit('staff:avail'); 
        }
        
        const handleDisconnection = () => {
            setIsConnected(false);
        }

        const handleReceiveMessage = async (msg) => {
            const decryptedAESKey = await RSAHandler.decryptDataWithRSAPrivate(msg.key);
            const decryptedMessage = await AESHandler.decryptDataWithAESKey(decryptedAESKey, msg.iv, msg.fileUrl ? msg.fileUrl : msg.message);
            if (msg.fileUrl) {
                msg.fileUrl = decryptedMessage;
            } else {
                msg.message = decryptedMessage;
            }
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
            setSelectedChatId((prev) => {
                if (prev === caseID) {
                    return null;
                }
                return prev;
            })

            setConnectedChats((prevChats) => {
                setDisconnectedChats((prevDisconChats) => [...prevDisconChats, prevChats.filter((chat) => chat.caseID === caseID)[0]]);
                setToastVisibilities((prev) => [...prev, true]);

                const updatedChats = prevChats.filter((chat) => chat.caseID !== caseID);
                return updatedChats;
            });
        }

        const handleReconnectAddChats = (chats) => {
            setConnectedChats(chats);
            socket.emit("utils:add-socket", null, "staff", (res) => {});
            for (const chat of chats) {
                socket.emit("utils:request-public-key", chat.caseID);
            }
        }

        const handleReceiveRSAPublicKey = (res) => {
            console.log(`Received Key from ${res.case}`)
            setRsaPublicKeys((prev) => [...prev, {
                key: res.key,
                caseId: res.case,
            }]);
        }

        const sendRSAPublicKey = (obj) => {
            RSAHandler.retrieveRSAKeyPair("rsa-public").then((res) => {
                console.log(`Sending Key to ${obj}`)
                socket.emit("utils:share-keys", {
                    key: res.key,
                    case: obj
                });
            });

        }

        // Handle Event Listeners
        socket.on("connect", handleConnection);
        socket.on("disconnect", handleDisconnection);
        socket.on("staff:avail-chats", handleSetWaitingCustomers)
        socket.on("utils:receive-msg", handleReceiveMessage);
        socket.on("utils:chat-ended", handleChatEnded);
        socket.on("staff:active-chats", handleReconnectAddChats);
        socket.on("utils:receive-keys", handleReceiveRSAPublicKey);
        socket.on("utils:request-public-key", sendRSAPublicKey); 
        socket.on("error", (err) => console.error(err));
        
        return () => {
            // Clear Event Listeners on Deconstructor
            socket.off("connect", handleConnection);
            socket.off("disconnect", handleDisconnection);
            socket.off("staff:avail-chats", handleSetWaitingCustomers)
            socket.off("utils:receive-msg", handleReceiveMessage);
            socket.off("utils:chat-ended", handleChatEnded);
            socket.off("staff:active-chats", handleReconnectAddChats);
            socket.off("utils:receive-keys", handleReceiveRSAPublicKey);
            socket.off("utils:request-public-key", sendRSAPublicKey); 
        }
    }, []);

    useEffect(() => {
        if (isConnected) {
            socket.emit('staff:avail'); 
            // Retrieve Active Chats, if exists, load it
            socket.emit("staff:active-chats");
        }
    }, [isConnected])

    async function onUploadClick() {
        try {
            const fileUrl = await handleFileUpload(selectedChatId);
            
            sendMessage(fileUrl);
        } catch (err) {
            console.error('Error during file upload:', err);
        }
    }

    // TODO: Improve Error 
    if (!isConnected) return <p>Error: Socket connection not made</p>

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
                    {selectedChatId && connectedChats.filter((chat) => chat.caseID === selectedChatId).map((selectedChat => (
                        <div id="chat-header" className={`${selectedChatId ? "" : "hidden"} w-full bg-neutral-100 border-y border-gray-300 flex flex-row px-4 py-2`}>
                            <div>
                                <p className="text-lg font-bold mb-0">{ selectedChat.customer?.faqQuestion }</p>
                                <p className="text-neutral-500 text-sm">FAQ Category: { selectedChat.customer?.faqSection }</p>
                                <p className="text-neutral-500 text-sm">Case ID: { selectedChat.caseID }{ selectedChat.customer?.userID && " | Logged In" }</p>
                            </div>

                            <button className="ml-auto px-4 py-1 bg-ocbcred hover:bg-ocbcdarkred text-white rounded-lg" onClick={handleEndChat}>
                                End Chat
                            </button>
                            <button className="ml-2 px-4 py-1 bg-ocbcred hover:bg-ocbcdarkred text-white rounded-lg" onClick={handleAppointmentClick}>
                                Recommend Appointment
                            </button>
                        </div>
                    )))}

                    <div id="chat" className={`w-full flex-grow flex flex-col ${selectedChatId ? "" : "hidden"}`}>
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
                        <MessageTextField setSentMessage={setSentMessage} sentMessage={sentMessage} sendMessage={sendMessage} onUploadClick={onUploadClick} socket={socket} />
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
                    <ToastMessage
                        description={`Customer with Case ID: ${chat.caseID} has left the chat`}
                        isShown={toastVisiblities[index]}
                        hideToast={handleHideToastMsg}
                        index={index}
                        type="warn"
                    />
                ))}
            </div>

            { error.isShown && (
                <ToastMessage
                    title="Authentication"
                    description="An error occured with making a secure connection with the server."
                    isShown={error.isShown}
                    hideToast={() => setError({ ...error, isShown: false })}
                    type="error"
                />
            )}
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