import { addWaitingCustomers, removeWaitingCustomer, searchForWaitingCustomer } from "../utils/sqliteDB.js";
import { notifyForWaitingCustomers } from "./staffHandler.js";

export default function (io, db, socket) {
    socket.on("customer:join", async (customerSessionIdentifier, section, question) => {
        const customerData = {
            customerSessionIdentifier: customerSessionIdentifier,
            faqSection: section,
            faqQuestion: question,
            socketId: socket.id,
            userId: socket?.user?.id || null,
            timeConnected: Date.now(),
        };
        console.log(customerData);

        // If customer is already in the waiting list, and Socket ID is present, ignore the request
        const requestWaitingCustomer = await searchForWaitingCustomer(db, customerSessionIdentifier);
        if (requestWaitingCustomer && requestWaitingCustomer.socketIDs.includes(socket.id)) {
            return;
        }

        // Else, add the customer to the localDB, and notify the staff
        await addWaitingCustomers(db, customerData);

        await notifyForWaitingCustomers(db, io);

        socket.join(customerSessionIdentifier); // Connect the Customer's Socket to a room with ID of customerSessionIdentifier
        io.to(customerSessionIdentifier).emit("utils:waiting-time", Math.floor(Math.random() * 5) + 1); // TODO: Random Number lolxd
    });

    socket.on("customer:leave", async () => {
        // Remove customer from Waiting Customer List
        await removeWaitingCustomer(db, socket.id);
    });
}