import { io } from 'socket.io-client';

const socketURL = 'http://localhost:8080';
export const socket = io(socketURL, {
    transports: ['websocket'], // Disable HTTP Polling
    withCredentials: true,
});