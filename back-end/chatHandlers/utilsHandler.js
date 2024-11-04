import { appendCustSIDToActiveChat, searchCustomerInActiveChat, searchForWaitingCustomer, saveMessages, retrieveChatMessages, addSocketIdToAvailStaff, getChatIdsForStaff, endActiveChat } from "../utils/sqliteDB.js";

export default function (io, db, socket) {
    /*
    msg Object
    {
        case: "caseID",
        message: "message",
        timestamp: "unix timestamp in miliseconds",
        sender: "sender (customer/staff)",
        sessionIdentifier: "customerSessionIdentifier / staffID"
    }
    */
    socket.on("utils:send-msg", async (msg) => {
        if (msg.sender === "staff") {
            msg["sessionIdentifier"] = socket.user.id;
        }
        await saveMessages(db, msg);
        io.to(msg.case).emit("utils:receive-msg", msg);
    });
    
    // Using a sessionIdentifier (customer / staff), add the new Socket ID to the Active Chat
    socket.on("utils:add-socket", async (sessionIdentifier, role) => {
        if (role === "customer") {
            const searchActiveChat = await searchCustomerInActiveChat(db, sessionIdentifier);

            if (searchActiveChat) {
                if (!searchActiveChat.customerSocketIDs.includes(socket.id)) {
                    await appendCustSIDToActiveChat(db, searchActiveChat.caseID, socket.id);
                    io.sockets.sockets.get(socket.id).join(searchActiveChat.caseID);
                }
            }
        } else if (role === "staff") {
            const staffChatIds = await getChatIdsForStaff(db, socket.user.id);
            await addSocketIdToAvailStaff(db, socket.user.id, socket.id);
            for (const chat of staffChatIds) {
                // Rejoin all chats
                io.sockets.sockets.get(socket.id).join(chat.caseID);
            }
        }
    })

    socket.on("utils:verify-waitinglist", async (customerSessionIdentifier, callback) => {
        const searchCustomer = await searchForWaitingCustomer(db, customerSessionIdentifier);
        console.log(customerSessionIdentifier, searchCustomer)
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