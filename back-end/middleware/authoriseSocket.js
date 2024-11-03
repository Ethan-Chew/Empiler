import cookie from "cookie";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function (io) {
    // Verify if the user is authorised to connect
    // Since unauthenticated users are allowed to make Live Chats, the JWT Token is only verified if it exists

    io.use((socket, next) => {
        const cookiesString = socket.handshake.headers.cookie ?? '';
        const cookies = cookie.parse(cookiesString);
        const authToken = cookies.jwt ?? null;
        
        if (authToken) {
            try {
                const decoded = jwt.verify(authToken, process.env.JWT_SECRET); 
                // stupidity note: i spent 4hrs looking for a bug,
                // because this (^^^) was marked async for some reason
                socket.user = decoded;
            } catch (err) {
                console.log("Error: " + err.message);
                return next(new Error("Authentication Error"));
            }
        }

        return next();
    });
}