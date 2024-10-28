import { io } from 'socket.io-client';

const socketURL = 'http://localhost:8080';

const socket = io(socketURL, {
    withCredentials: true,
});

export { socket };