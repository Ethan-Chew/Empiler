import { addWaitingCustomers, removeWaitingCustomer, searchForWaitingCustomer, endActiveChat, retrieveWaitingCustomers, retrieveQueueLength } from "../utils/sqliteDB.js";
import { notifyForWaitingCustomers } from "./staffHandler.js";

export async function getCustomersAhead (db, io) {
    const waitingCustomers = await retrieveWaitingCustomers(db);

    for (const customer of waitingCustomers) {
        const targetSocketId = customer.socketIDs[0];
        console.log(`Emitting to socket ID: ${targetSocketId}`);
    
        if (io.sockets.sockets.has(targetSocketId)) {
            console.log(`Sending queue position to ${targetSocketId}`);
            io.to(targetSocketId).emit("utils:waiting-time", customer.queuePosition);
        } else {
            console.log(`Socket ID ${targetSocketId} is not active`);
        }
    }
};

export async function getQueueLength (db, socket) {
    try {
        const queueLength = await retrieveQueueLength(db); 
        socket.emit('queue:length', queueLength);
    } catch (err) {
        console.error('Error retrieving queue length:', err);
    }
};

export default function (io, db, socket) {

    socket.on('customer:request-queue-position', async (customerSessionIdentifier) => {
        console.log("Requesting Queue Position");
        const customer = await searchForWaitingCustomer(db, customerSessionIdentifier);
        const queueLength = await retrieveQueueLength(db);

        if (customer) {
            // Update the customer's socketId in the database
            const updatedSocketID = [socket.id];
            await db.run(
                'UPDATE waitingCustomers SET socketIDs = ? WHERE customerSessionIdentifier = ?',
                JSON.stringify(updatedSocketID),
                customerSessionIdentifier
            );

            console.log(`Customer reconnected: ${customerSessionIdentifier}, new socketId: ${socket.id}`);

            // Emit current queue position to the reconnected customer
            socket.emit('utils:waiting-time', customer.queuePosition);
            socket.emit('queue:length', queueLength);
        }
    });

    socket.on("customer:join", async (customerSessionIdentifier, section, question) => {

        const customerData = {
            customerSessionIdentifier: customerSessionIdentifier,
            faqSection: section,
            faqQuestion: question,
            socketId: socket.id,
            userID: socket?.user?.id || null,
            timeConnected: Date.now(),
        };

        // If customer is already in the waiting list, and Socket ID is present, ignore the request
        console.log("Checking if customer is already in the waiting list");
        const requestWaitingCustomer = await searchForWaitingCustomer(db, customerSessionIdentifier);
        if (requestWaitingCustomer) {
            return;
        }

        // Else, add the customer to the localDB, and notify the staff
        await addWaitingCustomers(db, customerData);
        await notifyForWaitingCustomers(db, io);

        //Notify customer of queue postition
        await getCustomersAhead(db, io);
        await getQueueLength(db, socket);

        socket.join(customerSessionIdentifier); // Connect the Customer's Socket to a room with ID of customerSessionIdentifier
    });

    socket.on("customer:leave", async (sessionIdentifier) => {
        // Remove customer from Waiting Customer List
        try {
            await removeWaitingCustomer(db, sessionIdentifier);
        }
        catch (error) {
            console.log(error);
        }
        console.log("Customer has left the waiting list");
        await getCustomersAhead(db, io);
        await getQueueLength(db, socket);
        await notifyForWaitingCustomers(db, io);
    });

    socket.on("customer:end-chat", async (caseID) => {
        // Let the Customer know the Chat has ended
        socket.to(caseID).emit("utils:chat-ended");

        // Remove the Chat from the list of Active Chats
        await endActiveChat(db, caseID);
    })
}