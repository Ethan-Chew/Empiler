import { searchActiveChat } from "../utils/localDB.js";

export default function (io, db, socket) {
    socket.on("utils:send-msg", async (msg) => {
        io.to(msg.case).emit("utils:receiveMsg", msg);
    });

    socket.on("utils:verify-caseid", async (caseID, callback) => {
        const chatExists = searchActiveChat(db, caseID);

        callback({
            chatExists: chatExists
        });
    });
}