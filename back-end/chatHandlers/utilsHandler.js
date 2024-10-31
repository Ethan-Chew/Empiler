import { appendCustSIDToActiveChat, appendStaffSIDToActiveChat, searchAdminInActiveChat, searchCustomerInActiveChat, searchForWaitingCustomer } from "../utils/localDB.js";

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
        io.to(msg.case).emit("utils:receive-msg", msg);
    });
    
    // Using a sessionIdentifier (customer / staff), add the new Socket ID to the Active Chat
    socket.on("utils:add-socket", async (sessionIdentifier, role) => {
        if (role === "customer") {
            const searchActiveChat = await searchCustomerInActiveChat(db, sessionIdentifier);

            if (searchActiveChat) {
                if (!searchActiveChat.customer.socketIDs.includes(socket.id)) {
                    appendCustSIDToActiveChat(db, searchActiveChat.caseID, socket.id);
                    io.sockets.sockets.get(socket.id).join(searchActiveChat.caseID);
                }
            }
        } else if (role === "staff") {
            const searchActiveChat = await searchAdminInActiveChat(db, sessionIdentifier);

            if (searchActiveChat) {
                if (!searchActiveChat.staff.socketIDs.includes(socket.id)) {
                    appendStaffSIDToActiveChat(db, searchActiveChat.caseID, socket.id);
                    io.sockets.sockets.get(socket.id).join(searchActiveChat.caseID);
                }
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
            callback({
                exist: true,
                caseID: searchActiveChat.caseId
            });
        } else {
            callback({
                exist: false
            })
        }
    });
}