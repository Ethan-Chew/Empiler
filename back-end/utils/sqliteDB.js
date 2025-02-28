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
            timeConnected INTEGER,
            queuePosition INTEGER
        );
        CREATE TABLE IF NOT EXISTS availStaff (
            staffID TEXT PRIMARY KEY,
            socketIDs TEXT,
            name TEXT
        );
        CREATE TABLE IF NOT EXISTS activeChats (
            caseID TEXT PRIMARY KEY,
            customerSessionIdentifier TEXT,
            customerSocketIDs TEXT,
            faqSection TEXT,
            faqQuestion TEXT,
            userID TEXT,
            chatWaitingTime INTEGER,
            staffID TEXT
        );
        CREATE TABLE IF NOT EXISTS chatHistory (
            id TEXT,
            caseID TEXT,
            sessionIdentifier TEXT,
            timestamp INTEGER,
            message TEXT,
            fileUrl TEXT,
            sender TEXT,
            key TEXT,
            iv TEXT,
            queueLength INTEGER,
            staffID TEXT,
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
        await db.run(
            'UPDATE waitingCustomers SET socketIDs = ? WHERE customerSessionIdentifier = ?',
            JSON.stringify(socketIDs),
            customerData.customerSessionIdentifier
        );
    } else {
        const maxPosition = await db.get('SELECT MAX(queuePosition) as maxPos FROM waitingCustomers');
        customerData.socketIDs = JSON.stringify([customerData.socketId]);
        customerData.queuePosition = (maxPosition?.maxPos ?? -1) + 1;

        await db.run(
            'INSERT INTO waitingCustomers (customerSessionIdentifier, socketIDs, faqSection, faqQuestion, userID, timeConnected, queuePosition) VALUES (?, ?, ?, ?, ?, ?, ?)',
            customerData.customerSessionIdentifier,customerData.socketIDs,customerData.faqSection,customerData.faqQuestion,customerData.userID,customerData.timeConnected,customerData.queuePosition
        );
    }
};

export const retrieveWaitingCustomers = async (db) => {
    const rows = await db.all('SELECT * FROM waitingCustomers ORDER BY queuePosition ASC');
    return rows.map(row => ({ ...row, socketIDs: JSON.parse(row.socketIDs) }));
};

export const retrieveQueueLength = async (db) => {
    const result = await db.get('SELECT COUNT(*) as queueLength FROM waitingCustomers');
    return result.queueLength || 0;
};

export const removeWaitingCustomer = async (db, customerSessionIdentifier) => {
    const customer = await searchForWaitingCustomer(db, customerSessionIdentifier);
    if (customer) {
        const currentPos = customer.queuePosition;

        await db.run('DELETE FROM waitingCustomers WHERE customerSessionIdentifier = ?', customerSessionIdentifier);
        await db.run(
            'UPDATE waitingCustomers SET queuePosition = queuePosition - 1 WHERE queuePosition > ?',
            currentPos
        );
    }
};

export const searchForWaitingCustomer = async (db, customerSessionIdentifier) => {
    const row = await db.get('SELECT * FROM waitingCustomers WHERE customerSessionIdentifier = ?', customerSessionIdentifier);

    return row ? { ...row, socketIDs: JSON.parse(row.socketIDs) } : null;
};

export const addAvailStaff = async (db, staffData) => {
    const staffProfile = await searchForAvailStaff(db, staffData.staffID);
    if (staffProfile) {
        const socketIDs = staffData.socketIDs;
        if (staffProfile.socketIDs.includes(socketIDs[0])) return;
        socketIDs.push(socketIDs[0]);
        await db.run('UPDATE availStaff SET socketIDs = ? WHERE staffID = ?', JSON.stringify(socketIDs), staffData.staffID);
    } else {
        staffData.socketIDs = JSON.stringify(staffData.socketIDs);
        await db.run('INSERT INTO availStaff (socketIDs, staffID, name) VALUES (?, ?, ?)', 
            staffData.socketIDs, staffData.staffID, staffData.name);
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
    // Retrieve the Customer from the Waiting Customers DB
    const currentTime = Date.now();
    const chatWaitingTime = (currentTime - activeChat.customer.timeConnected) / 60000; // Converted to Minutes

    activeChat.customer.socketIDs = JSON.stringify(activeChat.customer.socketIDs);
    activeChat.staff.socketIDs = JSON.stringify(activeChat.staff.socketIDs);
    await db.run('INSERT INTO activeChats (caseID, customerSessionIdentifier, customerSocketIDs, faqSection, faqQuestion, userID, chatWaitingTime, staffID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        activeChat.caseID, activeChat.customer.customerSessionIdentifier, activeChat.customer.socketIDs, activeChat.customer.faqSection, activeChat.customer.faqQuestion, activeChat.customer.userID, chatWaitingTime, activeChat.staff.staffID);
};

export const endActiveChat = async (db, caseID, isCustomerDisconnect) => {
    // Save the Chat to the Chat History DB (Supabase)
    const chat = await db.get('SELECT * FROM activeChats WHERE caseID = ?', caseID);
    const chatMessages = await retrieveChatMessages(db, caseID);
    const formattedChatMessages = chatMessages.map(msg => ({
        timestamp: msg.timestamp,
        message: msg.message,
        sender: msg.sender
    }));

    // DEV: Commented to prevent spam to Databse when testing.
    try {
        await chatHistory.createChatHistory(chat.caseID, chat.userID, chat.staffID, formattedChatMessages, chat.chatWaitingTime);
    } catch (err) {
        console.error(err);
    }

    await db.run('DELETE FROM activeChats WHERE caseID = ?', caseID);
    await db.run('DELETE FROM chatHistory WHERE caseID = ?', caseID);
};

export const getActiveChatsForStaff = async (db, staffID) => {
    const chats = await db.all('SELECT * FROM activeChats WHERE staffID = ?', staffID);
    
    const formattedChats = await Promise.all(chats.map(async (chat) => {
        const chatMessages = await retrieveChatMessages(db, chat.caseID);

        return {
            caseID: chat.caseID,
            customer: {
                customerSessionIdentifier: chat.customerSessionIdentifier,
                socketIDs: chat.customerSocketIDs,
                faqSection: chat.faqSection,
                faqQuestion: chat.faqQuestion,
                userID: chat.userID,
                timeConnected: chat.timeConnected
            },
            staff: {
                staffID: chat.staffID,
            },
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

    const queueData = await db.get(
        'SELECT queuePosition FROM waitingCustomers WHERE customerSessionIdentifier = ?',
        [msg.sessionIdentifier]
    );

    const queueLength = queueData ? queueData.queuePosition : 0;

    await db.run('INSERT INTO chatHistory (id, caseID, sessionIdentifier, timestamp, message, fileUrl, sender, key, iv, queueLength) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        msg.id, msg.case, msg.sessionIdentifier, msg.timestamp, msg.message, msg.fileUrl, msg.sender, msg.key, msg.iv, queueLength);
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

export const getQueueLengthsForStaff = async (db, staffId) => {
    try {
        const results = await db.all(
            `SELECT queueLength FROM chatHistory WHERE staffID = ?`,
            [staffId]
        );

        if (!results || results.length === 0) {
            return "error";
        }

        return results.map(row => row.queueLength || 0);
    } catch (error) {
        console.error("Database error fetching queue lengths:", error);
        return [];
    }
};