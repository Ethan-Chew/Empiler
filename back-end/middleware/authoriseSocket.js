import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function (io) {
    // Verify if the user is authorised to connect
    io.use((socket, next) => {
        const cookiesString = socket.handshake.headers.cookie ?? '';
        const cookies = cookie.parse(cookiesString);
        const authToken = cookies.authToken ?? null;

        if(!authToken) {
            next(new Error("Authentication Token not found."));
        }

        jwt.verify(authToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                next(new Error("Invalid Authentication Token."));
            }

            socket.user = user;
            next();
        });
    });
}