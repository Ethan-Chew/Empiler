import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import chatHistory from '../models/chatHistory.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbFile = join(__dirname, 'db.sqlite');

export const initialiseDB = async () => {
    const db = await open({
        filename: dbFile,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS waitingCustomers (
            customerSessionIdentifier TEXT PRIMARY KEY,
            socketIDs TEXT,
            faqSection TEXT,
            faqQuestion TEXT,
            userID TEXT,
            timeConnected INTEGER
        );
        CREATE TABLE IF NOT EXISTS availStaff (
            staffID TEXT PRIMARY KEY,
            socketIDs TEXT
        );
        CREATE TABLE IF NOT EXISTS activeChats (
            caseID TEXT PRIMARY KEY,
            customerSessionIdentifier TEXT,
            customerSocketIDs TEXT,
            faqSection TEXT,
            faqQuestion TEXT,
            userID TEXT,
            timeConnected INTEGER,
            staffID TEXT
        );
        CREATE TABLE IF NOT EXISTS chatHistory (
            caseID TEXT,
            sessionIdentifier TEXT,
            timestamp INTEGER,
            message TEXT,
            sender TEXT,
            PRIMARY KEY (caseID, timestamp, sender)
        );
    `);

    return db;
};

export const addWaitingCustomers = async (db, customerData) => {
    const customerProfile = await searchForWaitingCustomer(db, customerData.customerSessionIdentifier);
    if (customerProfile) {
        const socketIDs = JSON.parse(customerProfile.socketIDs);
        socketIDs.push(customerData.socketId);
        await db.run('UPDATE waitingCustomers SET socketIDs = ? WHERE customerSessionIdentifier = ?', JSON.stringify(socketIDs), customerData.customerSessionIdentifier);
    } else {
        customerData.socketIDs = JSON.stringify([customerData.socketId]);
        delete customerData.socketId;
        await db.run('INSERT INTO waitingCustomers (customerSessionIdentifier, socketIDs, faqSection, faqQuestion, userID, timeConnected) VALUES (?, ?, ?, ?, ?, ?)', 
            customerData.customerSessionIdentifier, customerData.socketIDs, customerData.faqSection, customerData.faqQuestion, customerData.userID, customerData.timeConnected);
    }
};

export const retrieveWaitingCustomers = async (db) => {
    const rows = await db.all('SELECT * FROM waitingCustomers');
    return rows.map(row => ({ ...row, socketIDs: JSON.parse(row.socketIDs) }));
};

export const removeWaitingCustomer = async (db, customerSessionIdentifier) => {
    await db.run('DELETE FROM waitingCustomers WHERE customerSessionIdentifier = ?', customerSessionIdentifier);
};

export const searchForWaitingCustomer = async (db, customerSessionIdentifier) => {
    const row = await db.get('SELECT * FROM waitingCustomers WHERE customerSessionIdentifier = ?', customerSessionIdentifier);

    return row ? { ...row, socketIDs: JSON.parse(row.socketIDs) } : null;
};

export const addAvailStaff = async (db, staffData) => {
    const staffProfile = await searchForAvailStaff(db, staffData.staffID);
    if (staffProfile) {
        const socketIDs = staffData.socketIDs;
        socketIDs.push(staffProfile.socketIDs[0]);
        await db.run('UPDATE availStaff SET socketIDs = ? WHERE staffID = ?', JSON.stringify(socketIDs), staffData.staffID);
    } else {
        staffData.socketIDs = JSON.stringify(staffData.socketIDs);
        await db.run('INSERT INTO availStaff (socketIDs, staffID) VALUES (?, ?)', 
            staffData.socketIDs, staffData.staffID);
    }
};
export const retrieveAvailStaff = async (db) => {
    const rows = await db.all('SELECT * FROM availStaff');
    return rows.map(row => ({ ...row, socketIDs: JSON.parse(row.socketIDs) }));
};

export const removeAvailStaff = async (db, staffID) => {
    await db.run('DELETE FROM availStaff WHERE staffID = ?', staffID);
};

export const searchForAvailStaff = async (db, staffID) => {
    const row = await db.get('SELECT * FROM availStaff WHERE staffID = ?', staffID);
    return row ? { ...row, socketIDs: JSON.parse(row.socketIDs) } : null;
};

export const startActiveChat = async (db, activeChat) => {
    activeChat.customer.socketIDs = JSON.stringify(activeChat.customer.socketIDs);
    activeChat.staff.socketIDs = JSON.stringify(activeChat.staff.socketIDs);
    await db.run('INSERT INTO activeChats (caseID, customerSessionIdentifier, customerSocketIDs, faqSection, faqQuestion, userID, timeConnected, staffID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        activeChat.caseId, activeChat.customer.customerSessionIdentifier, activeChat.customer.socketIDs, activeChat.customer.faqSection, activeChat.customer.faqQuestion, activeChat.customer.userID, activeChat.customer.timeConnected, activeChat.staff.staffID);
};

export const endActiveChat = async (db, caseID) => {
    // Save the Chat to the Chat History DB (Supabase)
    const chat = await db.get('SELECT * FROM activeChats WHERE caseID = ?', caseID);
    const chatMessages = await retrieveChatMessages(db, caseID);
    const formattedChatMessages = chatMessages.map(msg => ({
        timestamp: msg.timestamp,
        message: msg.message,
        sender: msg.sender
    }));

    // DEV: Commented to prevent spam to Databse when testing.
    // try {
    //     await chatHistory.createChatHistory(chat.userID, chat.staffID, formattedChatMessages);
    // } catch (err) {
    //     console.error(err);
    // }

    await db.run('DELETE FROM activeChats WHERE caseID = ?', caseID);
    await db.run('DELETE FROM chatHistory WHERE caseID = ?', caseID);
};

export const getActiveChatsForStaff = async (db, staffID) => {
    const chats = await db.all('SELECT * FROM activeChats WHERE staffID = ?', staffID);
    
    const formattedChats = await Promise.all(chats.map(async (chat) => {
        const chatMessages = await retrieveChatMessages(db, chat.caseID);

        return {
            ...chat,
            messages: chatMessages
        };
    }));

    return formattedChats;
};

export const appendCustSIDToActiveChat = async (db, caseID, socketID) => {
    const chat = await searchActiveChat(db, caseID);
    const socketIDs = chat.customerSocketIDs;
    socketIDs.push(socketID);
    await db.run('UPDATE activeChats SET customerSocketIDs = ? WHERE caseID = ?', JSON.stringify(socketIDs), caseID);
};

// Save Chat Messages
export const saveMessages = async (db, msg) => {
    await db.run('INSERT INTO chatHistory (caseID, sessionIdentifier, timestamp, message, sender) VALUES (?, ?, ?, ?, ?)', 
        msg.case, msg.sessionIdentifier, msg.timestamp, msg.message, msg.sender);
}
export const retrieveChatMessages = async (db, caseID) => {
    const rows = await db.all('SELECT * FROM chatHistory WHERE caseID = ?', caseID);
    return rows;
}

// Search Functions
export const searchActiveChat = async (db, caseID) => {
    const row = await db.get('SELECT * FROM activeChats WHERE caseID = ?', caseID);
    return row ? { ...row, customerSocketIDs: JSON.parse(row.customerSocketIDs) } : null;
};

export const searchCustomerInActiveChat = async (db, customerSessionIdentifier) => {
    const row = await db.get('SELECT * FROM activeChats WHERE customerSessionIdentifier = ?', customerSessionIdentifier);
    return row ? { ...row, customerSocketIDs: JSON.parse(row.customerSocketIDs) } : null;
};

export const getChatIdsForStaff = async (db, staffID) => {
    return await db.all('SELECT caseID FROM activeChats WHERE staffID = ?', staffID);
}

export const searchStaffInActiveChat = async (db, staffID) => {
    const row = await db.get('SELECT * FROM activeChats WHERE staffID = ?', staffID);
    return row ? { ...row, customerSocketIDs: JSON.parse(row.customerSocketIDs) } : null;
};

export const addSocketIdToAvailStaff = async (db, staffID, socketID) => {
    const staffProfile = await searchForAvailStaff(db, staffID);
    const socketIDs = staffProfile.socketIDs;
    socketIDs.push(socketID);
    await db.run('UPDATE availStaff SET socketIDs = ? WHERE staffID = ?', JSON.stringify(socketIDs), staffID);
}