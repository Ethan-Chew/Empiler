import { appendCustSIDToActiveChat, searchCustomerInActiveChat, searchForWaitingCustomer, saveMessages, retrieveChatMessages, addSocketIdToAvailStaff, getChatIdsForStaff, endActiveChat } from "../utils/sqliteDB.js";

export default function (io, db, socket) {
    /*
    msg Object
    {
        case: "caseID",
        message: "message",
        timestamp: "unix timestamp in miliseconds",
        sender: "sender (customer/staff)",
        sessionIdentifier: "customerSessionIdentifier / staffSessionIdentifier"
    }
    */
    socket.on("utils:send-msg", async (msg) => {
        await saveMessages(db, msg);
        io.to(msg.case).emit("utils:receive-msg", msg);
    });
    
    // Using a sessionIdentifier (customer / staff), add the new Socket ID to the Active Chat
    socket.on("utils:add-socket", async (sessionIdentifier, role) => {
        if (role === "customer") {
            const searchActiveChat = await searchCustomerInActiveChat(db, sessionIdentifier);

            if (searchActiveChat) {
                if (!searchActiveChat.customerSocketIDs.includes(socket.id)) {
                    appendCustSIDToActiveChat(db, searchActiveChat.caseID, socket.id);
                    io.sockets.sockets.get(socket.id).join(searchActiveChat.caseID);
                }
            }
        } else if (role === "staff") {
            const staffChatIds = await getChatIdsForStaff(db, sessionIdentifier);
            addSocketIdToAvailStaff(db, sessionIdentifier, socket.id);
            for (const chat of staffChatIds) {
                // Rejoin all chats
                io.sockets.sockets.get(socket.id).join(chat.caseID);
            }
        }
    })

    socket.on("utils:verify-waitinglist", async (customerSessionIdentifier, callback) => {
        const searchCustomer = await searchForWaitingCustomer(db, customerSessionIdentifier);

        if (searchCustomer) {
            callback(true);
        } else {
            callback(false);
        }
    });

    socket.on("utils:verify-activechat", async (customerSessionIdentifier, callback) => {
        const searchActiveChat = await searchCustomerInActiveChat(db, customerSessionIdentifier);

        if (searchActiveChat) {
            const chatHistory = await retrieveChatMessages(db, searchActiveChat.caseID);
            callback({
                exist: true,
                caseID: searchActiveChat.caseID,
                chatHistory: chatHistory
            });
        } else {
            callback({
                exist: false
            })
        }
    });
    
    socket.on("utils:end-chat", async (caseId) => {
        // Let the Customer know the Chat has ended
        io.to(caseId).emit("utils:chat-ended", caseId);

        // Remove the Chat from the list of Active Chats
        await endActiveChat(db, caseId);
    });
}