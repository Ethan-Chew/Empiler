import { endActiveChat, retrieveWaitingCustomers, addAvailStaff, searchForWaitingCustomer, searchForAvailStaff, removeWaitingCustomer, startActiveChat, getActiveChatsForStaff } from "../utils/sqliteDB.js";
import crypto from "crypto";

export async function notifyForWaitingCustomers(db, io) {
    const waitingCustomers = await retrieveWaitingCustomers(db);

    // Format the Waiting Customers List into Sections and the rest of the data
    let formattedWaitingCustomers = {}; // Keys: Sections; Values: Customers
    for (const customer of waitingCustomers) {
        if (!(customer.faqSection in formattedWaitingCustomers)) {
            formattedWaitingCustomers[customer.faqSection] = [customer];
        } else {
            formattedWaitingCustomers[customer.faqSection].push(customer);
        }
    }

    io.emit("staff:avail-chats", formattedWaitingCustomers);
}

export default function (io, db, socket) {
    socket.on("staff:avail-chats", async () => {
        await notifyForWaitingCustomers(db, io);
    });

    socket.on("staff:avail", async () => {
        const staffData = {
            staffID: socket.user.id,
            socketIDs: [socket.id],
        };
        socket.join(staffData.staffID);
        await addAvailStaff(db, staffData);
        await notifyForWaitingCustomers(db, io);
    })

    socket.on("staff:join", async (customerSessionIdentifier, callback) => {
        const caseID = crypto.randomBytes(16).toString('hex');

        // Retrieve all the SocketIDs relating to the customerSessionIdentifier
        const customer = await searchForWaitingCustomer(db, customerSessionIdentifier);
        if (!customer) {
            return callback({
                status: "Error",
                message: "Customer not found"
            });
        }

        // Force Customer to join the Live Chat (Room)
        for (const socketId of customer.socketIDs) {
            const customerSocket = io.sockets.sockets.get(socketId);
            if (customerSocket) {
                customerSocket.join(caseID);
            }
        }

        // Allow the Staff to join the Live Chat (Room)
        socket.join(caseID);

        // Add the Chat to the list of Active Chats
        const staff = await searchForAvailStaff(db, socket.user.id);
        const newChat = {
            caseID: caseID,
            customer: customer,
            staff: staff,
        }
        await startActiveChat(db, newChat);

        // Remove the Customer from the Waiting List
        await removeWaitingCustomer(db, customerSessionIdentifier);

        // Broadcast caseID to Customer (notify that connection has been made successfully)
        io.to(customerSessionIdentifier).emit('utils:joined-chat', caseID);

        // Send a Callback to the Staff (notify successfully started Live Chat)
        callback({
            status: "Success",
            chat: {
                ...newChat,
            }
        });
    });

    socket.on("staff:active-chats", async () => {
        const activeChats = await getActiveChatsForStaff(db, socket.user.id);
        if (activeChats && activeChats.length !== 0) {
            io.to(socket.id).emit('staff:active-chats', activeChats);
        }
    })
}