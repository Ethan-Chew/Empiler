import { get } from "http";
import { appendCustSIDToActiveChat, searchCustomerInActiveChat, searchForWaitingCustomer, saveMessages, retrieveChatMessages, addSocketIdToAvailStaff, getChatIdsForStaff, endActiveChat, searchForAvailStaff, retrieveWaitingCustomers } from "../utils/sqliteDB.js";

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
        socket.broadcast.to(msg.case).emit("utils:receive-msg", msg);
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
        if (searchCustomer) {
            callback(true);
        } else {
            callback(false);
        }
    });

    socket.on("utils:verify-activechat", async (customerSessionIdentifier, callback) => {
        const searchActiveChat = await searchCustomerInActiveChat(db, customerSessionIdentifier);
        console.log(`Verifying Active Chat for ${customerSessionIdentifier} by ${socket.id}`);
        if (searchActiveChat) {
            const chatHistory = await retrieveChatMessages(db, searchActiveChat.caseID);
            const staffInformation = await searchForAvailStaff(db, searchActiveChat.staffID);
            callback({
                exist: true,
                caseID: searchActiveChat.caseID,
                chatHistory: chatHistory,
                staffName: staffInformation.name
            });
        } else {
            callback({
                exist: false
            })
        }
    });
    
    socket.on("utils:end-chat", async (caseID, isCustomerDisconnect) => {
        // Let the Customer know the Chat has ended
        socket.to(caseID).emit("utils:chat-ended", caseID);

        // Remove the Chat from the list of Active Chats
        await endActiveChat(db, caseID, isCustomerDisconnect);
    });

    /*
    Share Keys Object
    - key: Client's RSA Public Key
    - case: case ID
    */
    socket.on("utils:share-keys", async (obj) => {
        console.log(`Sharing Keys for ${obj.case} by ${socket.id}`);
        socket.broadcast.to(obj.case).emit("utils:receive-keys", obj);
    })

    // Share the RSA Public Key with the Client
    socket.on("utils:request-public-key", async (obj) => {
        console.log(`Requesting Public Key from ${obj} by ${socket.id}`);
        socket.broadcast.to(obj).emit("utils:request-public-key", obj);
    })
}