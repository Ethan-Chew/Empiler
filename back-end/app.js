import express from 'express';
import morgan from 'morgan'
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { initialiseDB } from './utils/sqliteDB.js';
import startAutoNotifJob from './utils/appointmentNotif.js';

// Routes
import user from './routes/user.route.js';
import chatHistory from './routes/chatHistory.route.js';
import faq from './routes/faq.route.js';
import auth from './routes/auth.route.js';
import translate from './routes/translate.route.js';
import appointment from './routes/appointment.route.js';
import branches from './controllers/branches.controller.js';

// Socket.IO Event Handlers
import chatAttachments from './routes/chatAttachments.route.js';
import staffHandler from './chatHandlers/staffHandler.js';
import customerHandler from './chatHandlers/customerHandler.js';
import utilsHandler from './chatHandlers/utilsHandler.js';
import authoriseSocket from './middleware/authoriseSocket.js';
import sttHandler from './chatHandlers/sttHandler.js';

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
app.use("/api/auth", auth);
app.post("/api/branches", branches.getOCBCBranches);
app.get("/api/branch", branches.getSpecificOCBCBranch);
app.use("/api/appointments", appointment);
app.use("/api/chat/upload", chatAttachments);
app.use("/api/translate", translate);

// Handle Socket.IO Connection
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
    debug: true,
    connectionStateRecovery: {
        skipMiddlewares: false,
    }
});

server.listen(8080, () => {
    console.log(`> Ready on http://localhost:8080`);
});

// Start Auto Notification Job
startAutoNotifJob();

authoriseSocket(io);
io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected from origin: ${socket.handshake.headers.origin}`);

    sttHandler(io, db, socket);
    utilsHandler(io, db, socket);
    customerHandler(io, db, socket);
    if (socket.user && socket.user.role === "staff") {
        staffHandler(io, db, socket);
    }
});