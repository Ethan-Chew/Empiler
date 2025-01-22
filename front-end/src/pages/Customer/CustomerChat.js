import NavigationBar from "../../components/Navbar";
import MessageContainer from "../../components/Chat/MessageContainer";
import handleFileUpload from "../../utils/handleFileUpload";
import { socket } from "../../utils/chatSocket";

import { useSearchParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import MessageTextField from "../../components/Chat/MessageTextField";
import RSAHandler from "../../utils/KeyHandlers/RSAHandler";
import ToastMessage from "../../components/ToastMessage";
import AESHandler from "../../utils/KeyHandlers/AESHandler";
import { useInactivity } from "../../hooks/useInactivity";
import indexedDB from "../../utils/KeyHandlers/indexedDB";

export default function CustomerChat() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [searchParams] = useSearchParams();
    const caseID = searchParams.get("caseID");

    const [messages, setMessages] = useState([]);
    const [chatEnded, setChatEnded] = useState(false);
    const [staffEndedChat, setStaffEndedChat] = useState(false);
    const [sentMessage, setSentMessage] = useState("");
    const [staffName, setStaffName] = useState("[insert name]");

    // E2E Encryption States
    const [ receiverRSAPublicKey, setReceiverRSAPublicKey ] = useState(null);

    // Error
    const [ error, setError ] = useState({
        title: "Authentication",
        description: "An error occured with making a secure connection with the server.",
        isShown: true,
        type: "error"
    })

    // Helper Function to handle Window's Visibility Change. When inactive for 3 minutes, show warning. When inactive for 4 minutes, disconnect
    const { userInactive, userDisconnected, resetInactivityTimer } = useInactivity({
        inactivityLimit: 3,
        disconnectLimit: 4,
        onDisconnect: () => socket.emit("utils:end-chat", caseID, true),
    });
    

    useEffect(() => {
        // If there is no Case ID, redirect the Customer back to the Landing Page
        if (!caseID) {
            navigateHome();
        }

        // Retrieve the Staff Name from the Location State
        if (location.state && "staffName" in location.state) {
            setStaffName(location.state.staffName);
        }

        // Generate the RSA Key Pair for the Customer
        RSAHandler.generateRSAKeyPair();

        // Socket.IO Event Handlers
        const handleConnection = () => {
            setIsConnected(true);
            
            const customerSessionIdentifier = sessionStorage.getItem("customerSessionIdentifier");
            if (!customerSessionIdentifier) {
                navigateHome();
            }

            socket.emit("utils:verify-activechat", customerSessionIdentifier, async (chatExistanceReq) => {
                setStaffName(chatExistanceReq.staffName);
                if (chatExistanceReq.exist && chatExistanceReq.caseID === caseID) {
                    // Add the new Socket to the Room
                    socket.emit("utils:add-socket", customerSessionIdentifier, "customer", async (res) => {
                        if (res) {
                            // Request for Staff's Public RSA Key
                            socket.emit("utils:request-public-key", caseID);
                            console.log("Requesting Public Key from Staff");
                        }
                    });

                    // Decrypt the Chat History
                    const decryptedChatHistory = [];
                    for (const msg of chatExistanceReq.chatHistory) {
                        let decryptedKey, decryptedMessage;
                        if (msg.sender === "customer") {
                            // AES Key is stored in IndexedDB -> Retrieve and Decrypt
                            const key = await AESHandler.retrieveAESKeyWithMessageId(msg.id);
                            decryptedMessage = await AESHandler.decryptDataWithAESKey(key.key, key.iv, msg.fileUrl || msg.message);
                        } else {
                            // Key was sent by the Staff, so decrypt with Customer's RSA Private Key, before decrypting message
                            decryptedKey = await RSAHandler.decryptDataWithRSAPrivate(msg.key);
                            decryptedMessage = await AESHandler.decryptDataWithAESKey(decryptedKey, msg.iv, msg.fileUrl || msg.message);
                        }

                        if (msg.fileUrl) {
                            msg.fileUrl = decryptedMessage;
                        } else {
                            msg.message = decryptedMessage;
                        }

                        decryptedChatHistory.push(msg);
                    }

                    // Sort Chat History by Timestamp
                    decryptedChatHistory.sort((a, b) => a.timestamp - b.timestamp);
                    setMessages(decryptedChatHistory);
                } else {
                    navigateHome();
                }
            });
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

            setMessages(prev => [...prev, msg]);
        }

        const handleChatClosure = () => {
            setStaffEndedChat(true);
            setChatEnded(true);
            sessionStorage.removeItem("customerSessionIdentifier");
            indexedDB.clearObjectStore("aes-keys");
        }

        const sendRSAPublicKey = async (obj) => {
            RSAHandler.retrieveRSAKeyPair("rsa-public").then((res) => {
                console.log("Sending RSA Public Key to Server");
                socket.emit("utils:share-keys", {
                    key: res.key,
                    case: obj
                });
            });
        }

        const handleReceiveRSAPublicKey = (res) => {
            console.log("Received RSA Public Key from Staff");
            setReceiverRSAPublicKey(res.key);
            setError({ ...error, isShown: false });
        }

        socket.on("connect", (ctx) => {
            const initialGetTimeout = setTimeout(() => {
                console.log("Initial Connection Timeout");
                handleConnection(ctx);
                clearTimeout(initialGetTimeout);
            }, 1000);
        });
        // socket.on("connect", handleConnection);
        socket.on("disconnect", handleDisconnection);
        socket.on("utils:receive-msg", handleReceiveMessage);
        socket.on("utils:chat-ended", handleChatClosure);
        socket.on("utils:receive-keys", handleReceiveRSAPublicKey)
        socket.on("utils:request-public-key", sendRSAPublicKey); 

        return () => {
            socket.off("connect", handleConnection);
            socket.off("disconnect", handleDisconnection);
            socket.off("utils:receive-msg", handleReceiveMessage);
            socket.off("utils:chat-ended", handleChatClosure)
            socket.off("utils:request-public-key", sendRSAPublicKey); 
            socket.off("utils:receive-keys", handleReceiveRSAPublicKey)
        }
    }, [isConnected]);

    useEffect(() => {
        socket.emit("utils:request-public-key", caseID);
        console.log("Requesting Public Key from Staff");
    }, [receiverRSAPublicKey])

    async function sendMessage(fileUrl) {
        if (!sentMessage && !fileUrl) return;
    
        const isFile = Boolean(fileUrl);
        const currentTimestamp = Date.now();
        const sessionIdentifier = sessionStorage.getItem("customerSessionIdentifier");

        const messageObject = {
            id: crypto.randomUUID(),
            case: caseID,
            message: isFile ? null : sentMessage,
            fileUrl: isFile ? fileUrl : null,
            timestamp: currentTimestamp,
            sender: "customer",
            sessionIdentifier,
        }
    
        try {
            // Encrypt the content
            const aesKey = await AESHandler.generateAESKey();

            const contentToEncrypt = isFile ? fileUrl : sentMessage;
            const encryptedContent = await AESHandler.encryptDataWithAESKey(contentToEncrypt, aesKey);
            const encryptedKey = await RSAHandler.encryptDataWithRSAPublic(aesKey, receiverRSAPublicKey);
    
            // Prepare the formatted message
            const encryptedMessage = JSON.parse(JSON.stringify(messageObject));
            encryptedMessage.message = isFile ? null : encryptedContent.data;
            encryptedMessage.fileUrl = isFile ? encryptedContent.data : null;
            encryptedMessage.key = encryptedKey;
            encryptedMessage.iv = encryptedContent.iv;

            // Save the AES Key, IV and ID to the IndexedDB
            await AESHandler.saveAESKeyWithMessageId(aesKey, encryptedContent.iv, messageObject.id);
    
            // Send the message to the server via socket
            socket.emit("utils:send-msg", encryptedMessage);
    
            // Clear the input message state
            setSentMessage("");

            // Add message locally
            setMessages((prev) => [
                ...prev,
                messageObject
            ]);
        } catch (error) {
            console.error("Failed to send message:", error);
            setError({
                title: "Message Sending",
                description: "An error occured while sending the message. Please try again.",
                isShown: true,
                type: "error"
            })
        }
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
        indexedDB.clearObjectStore("aes-keys");
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

    if (!isConnected) return <><p>failed to connect.</p></>

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
                    {staffEndedChat ? (
                        <div className="px-10 py-6 md:py-4 w-full rounded-b-xl flex flex-col items-center border-t-2">
                            <p className="font-semibold text-lg mb-3">The Customer Support Representative has ended the Live Chat. We hope your problem was resolved!</p>
                            <button className="px-4 py-2 bg-ocbcred hover:bg-ocbcdarkred rounded-lg text-white" onClick={navigateRating}>
                                Continue
                            </button>
                        </div>
                    ) : (
                        <MessageTextField setSentMessage={setSentMessage} sentMessage={sentMessage} sendMessage={sendMessage} onUploadClick={onUploadClick} socket={socket} />
                    )}
                </div>
            </div>

            <InactivityPopup userInactive={userInactive} userDisconnected={userDisconnected} navigateRating={navigateRating} />

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
    );
}

const InactivityPopup = ({ userInactive, userDisconnected, navigateRating }) => {
    if (!userInactive) return null;
    return (
        <div id="inactivity-popup" className={`${userInactive ? "" : "hidden"} fixed top-0 left-0 h-screen w-screen bg-neutral-900/20 backdrop-blur-sm flex items-center justify-center duration-200 z-10`}>
            <div className="p-5 bg-white flex flex-col items-center justify-center">
                <h2 className="font-semibold text-2xl mb-2">Looks like you've been inactive for awhile.</h2>
                <p className="text-lg">{ userDisconnected ? "You have been disconnected from the Live Chat." : "Please interact with the window to continue." }</p>
                <button className="mt-3 px-4 py-2 bg-ocbcred hover:bg-ocbcdarkred rounded-lg text-white" onClick={navigateRating}>
                    Continue
                </button>
            </div>
        </div>
    )
}