import { addWaitingCustomers, retrieveWaitingCustomers } from "../utils/localDB";

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

        await addWaitingCustomers(db, customerData);

        await notifyForWaitingCustomers();
    });
}