import { addWaitingCustomers, removeWaitingCustomer, retrieveWaitingCustomers } from "../utils/localDB.js";

export default function (io, db, socket) {
    async function notifyForWaitingCustomers() {
        const waitingCustomers = await retrieveWaitingCustomers(db);
        io.emit("staff:availChats", waitingCustomers);
    }

    socket.on("customer:join", async (section, question) => {
        const customerData = {
            socketId: socket.id,
            faqSection: section,
            faqQuestion: question,
        };
        console.log(customerData);

        await addWaitingCustomers(db, customerData);

        await notifyForWaitingCustomers();

        io.to(socket.id).emit("utils:waiting-time", Math.floor(Math.random() * 5) + 1); // TODO: Random Number lolxd
    });

    socket.on("customer:leave", async () => {
        // Remove customer from Waiting Customer List
        await removeWaitingCustomer(db, socket.id);
    });
}