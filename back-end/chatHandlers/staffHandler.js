import { addAvailStaff } from "../utils/localDB.js";
import crypto from "crypto";

export default function (io, db, socket) {
    socket.on("staff:avail", async () => {
        const staffData = {
            socketId: socket.id,
            staffId: socket.user.id,
        };

        await addAvailStaff(db, staffData);
    })

    socket.on("staff:join", (customerSocketId, callback) => {
        const roomId = crypto.randomBytes(16).toString('hex');

        // Force the Customer Socket to join the Live Chat (Room)
        const customerSocket = io.sockets.sockets.get(socketId);
        if (customerSocket) {
            customerSocket.join(roomId);
            socket.join(roomId);

            // Add the Chat to the Active Chats List and Remove from Waiting Customers
            activeChats.push({ chatId: roomId, customer: customerSocket, staff: socket });
            waitingCustomers = waitingCustomers.filter((customer) => customer.id !== socketId);

            // Broadcast Chat ID to Customer
            io.to(customerSocketId).emit('joined-chat', {
                status: "Success",
                roomId: roomId,
            })

            callback({
                status: "Success",
                roomId: roomId
            });
        } else {
            callback({
                status: "Error",
                message: "Customer not found"
            })
        }
    });
}