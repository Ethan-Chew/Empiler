import express from 'express';
import morgan from 'morgan'
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import supabase from './supabase.js';
import cors from 'cors';
import { initialiseDB, addWaitingCustomers, retrieveWaitingCustomers } from './utils/localDB.js';

// Routes
import user from './routes/user.route.js';
import chatHistory from './routes/chatHistory.route.js';
import faq from './routes/faq.route.js';
import staffHandler from './chatHandlers/staffHandler.js';
import customerHandler from './chatHandlers/customerHandler.js';
import authoriseSocket from './middleware/authoriseSocket.js';

dotenv.config();

const app = express();

app.use(morgan('combined'));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Initialize Local Database
const db = await initialiseDB();

// API Routes
app.use("/api/user", user);
app.use("/api/chatHistory", chatHistory);
app.use("/api/faq", faq);

// Handle Socket.IO Connection
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
    debug: true,
});

//Default routes
// app.get('/', (req, res) => {
//     res.send("Hello I am working my friend Supabase <3");
// });

server.listen(8080, () => {
    console.log(`> Ready on http://localhost:8080`);
});

authoriseSocket(io);
io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected from origin: ${socket.handshake.headers.origin}`);

    try {
        if (socket.user.role === "staff") staffHandler(io, db, socket);
    } catch (err) {
        customerHandler(io, db, socket);
    }
});