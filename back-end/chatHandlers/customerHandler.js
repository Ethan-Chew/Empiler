import { addWaitingCustomers, removeWaitingCustomer, searchForWaitingCustomer, endActiveChat, retrieveWaitingCustomers } from "../utils/sqliteDB.js";
import { notifyForWaitingCustomers } from "./staffHandler.js";

export async function getCustomersAhead (db, io) {
    const waitingCustomers = await retrieveWaitingCustomers(db);

    for (const customer of waitingCustomers) {
        io.to(customer.socketIDs[0]).emit("utils:waiting-time", customer.queuePosition);
    }
};

export default function (io, db, socket) {
    

    socket.on("customer:join", async (customerSessionIdentifier, section, question) => {
        console.log("GDFHSJFJDFHKJSDHKJHSKJFSDHKJL");

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
            console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK");
            return;
        }

        // Else, add the customer to the localDB, and notify the staff
        await addWaitingCustomers(db, customerData);
        await notifyForWaitingCustomers(db, io);

        //Notify customer of queue postition
        await getCustomersAhead(db, io);

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
        await notifyForWaitingCustomers(db, io);
    });

    socket.on("customer:end-chat", async (caseID) => {
        // Let the Customer know the Chat has ended
        socket.to(caseID).emit("utils:chat-ended");

        // Remove the Chat from the list of Active Chats
        await endActiveChat(db, caseID);
    })
}