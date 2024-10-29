import { addWaitingCustomers, removeWaitingCustomer, retrieveWaitingCustomers, searchForWaitingCustomer } from "../utils/localDB.js";

export default function (io, db, socket) {
    async function notifyForWaitingCustomers() {
        const waitingCustomers = await retrieveWaitingCustomers(db);
        io.emit("staff:availChats", waitingCustomers);
    }

    socket.on("customer:join", async (customerSessionIdentifier, section, question) => {
        const customerData = {
            csi: customerSessionIdentifier,
            faqSection: section,
            faqQuestion: question,
            socketId: socket.id,
            userId: socket.user.id || null,
            timeConnected: Date.now(),
        };

        // If customer is already in the waiting list, and Socket ID is present, ignore the request
        const requestWaitingCustomer = await searchForWaitingCustomer(db, customerSessionIdentifier);
        if (requestWaitingCustomer && requestWaitingCustomer.socketIDs.includes(socket.id)) {
            return;
        }

        // Else, add the customer to the localDB, and notify the staff
        await addWaitingCustomers(db, customerData);

        await notifyForWaitingCustomers();

        socket.join(customerSessionIdentifier); // Connect the Customer's Socket to a room with ID of CSI
        io.to(customerSessionIdentifier).emit("utils:waiting-time", Math.floor(Math.random() * 5) + 1); // TODO: Random Number lolxd
    });

    socket.on("customer:leave", async () => {
        // Remove customer from Waiting Customer List
        await removeWaitingCustomer(db, socket.id);
    });
}