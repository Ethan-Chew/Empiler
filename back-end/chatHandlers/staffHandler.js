import { endActiveChat, retrieveWaitingCustomers, addAvailStaff, searchForWaitingCustomer, searchForAvailStaff, removeWaitingCustomer, startActiveChat } from "../utils/sqliteDB.js";
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

    socket.on("staff:avail", async (staffSessionIdentifier) => {
        const staffData = {
            staffSessionIdentifier: staffSessionIdentifier,
            staffId: socket.user?.id || null,
            socketIDs: [socket.id],
        };

        socket.join(staffSessionIdentifier); // Connect the Staff's Socket to a room with ID of SSI
        await addAvailStaff(db, staffData);
        await notifyForWaitingCustomers(db, io);
    })

    socket.on("staff:join", async (customerSessionIdentifier, staffSessionIdentifier, callback) => {
        const caseId = crypto.randomBytes(16).toString('hex');

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
                customerSocket.join(caseId);
            }
        }

        // Allow the Staff to join the Live Chat (Room)
        socket.join(caseId);

        // Add the Chat to the list of Active Chats
        const staff = await searchForAvailStaff(db, staffSessionIdentifier);
        const newChat = {
            caseId: caseId,
            customer: customer,
            staff: staff,
        }
        await startActiveChat(db, newChat);

        // Remove the Customer from the Waiting List
        await removeWaitingCustomer(db, customerSessionIdentifier);

        // Broadcast CaseID to Customer (notify that connection has been made successfully)
        io.to(customerSessionIdentifier).emit('utils:joined-chat', caseId);

        // Send a Callback to the Staff (notify successfully started Live Chat)
        callback({
            status: "Success",
            chat: {
                ...newChat,
            }
        });
    });
}