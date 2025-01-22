import { addWaitingCustomers, removeWaitingCustomer, searchForWaitingCustomer, endActiveChat, retrieveWaitingCustomers } from "../utils/sqliteDB.js";
import { notifyForWaitingCustomers } from "./staffHandler.js";

export default function (io, db, socket) {

    const getCustomersAhead = async (db, customerSessionIdentifier) => {
            const waitingCustomers = await retrieveWaitingCustomers(db);
            let customersAhead = 0;
            for (const customer of waitingCustomers) {
                if (customer.customerSessionIdentifier === customerSessionIdentifier) {
                    break;
                }
                customersAhead++;
            }
            return customersAhead;
        }

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
        const requestWaitingCustomer = await searchForWaitingCustomer(db, customerSessionIdentifier);
        if (requestWaitingCustomer) {
            return;
        }

        // Else, add the customer to the localDB, and notify the staff
        await addWaitingCustomers(db, customerData);

        await notifyForWaitingCustomers(db, io);

        socket.join(customerSessionIdentifier); // Connect the Customer's Socket to a room with ID of customerSessionIdentifier
        io.to(customerSessionIdentifier).emit("utils:waiting-time",
            await getCustomersAhead(db, customerSessionIdentifier)
        );
    });

    socket.on("customer:leave", async () => {
        // Remove customer from Waiting Customer List
        await removeWaitingCustomer(db, socket.user.id);
        await notifyForWaitingCustomers(db, io);
    });

    socket.on("customer:end-chat", async (caseID) => {
        // Let the Customer know the Chat has ended
        socket.to(caseID).emit("utils:chat-ended");

        // Remove the Chat from the list of Active Chats
        await endActiveChat(db, caseID);
    })
}