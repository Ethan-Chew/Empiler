import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

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
            userId TEXT,
            timeConnected INTEGER
        );
        CREATE TABLE IF NOT EXISTS availStaff (
            staffSessionIdentifier TEXT PRIMARY KEY,
            socketIDs TEXT,
            staffID TEXT
        );
        CREATE TABLE IF NOT EXISTS activeChats (
            caseID TEXT PRIMARY KEY,
            customerSessionIdentifier TEXT,
            customerSocketIDs TEXT,
            faqSection TEXT,
            faqQuestion TEXT,
            userId TEXT,
            timeConnected INTEGER,
            staffSessionIdentifier TEXT,
            staffSocketIDs TEXT,
            staffID TEXT
        );
    `);

    return db;
};

export const addWaitingCustomers = async (db, customerData) => {
    const customerProfile = await searchForWaitingCustomer(db, customerData.customerSessionIdentifier);
    console.log(customerProfile);

    if (customerProfile) {
        const socketIDs = JSON.parse(customerProfile.socketIDs);
        socketIDs.push(customerData.socketId);
        await db.run('UPDATE waitingCustomers SET socketIDs = ? WHERE customerSessionIdentifier = ?', JSON.stringify(socketIDs), customerData.customerSessionIdentifier);
    } else {
        console.log("Adding new customer");
        customerData.socketIDs = JSON.stringify([customerData.socketId]);
        delete customerData.socketId;
        await db.run('INSERT INTO waitingCustomers (customerSessionIdentifier, socketIDs, faqSection, faqQuestion, userId, timeConnected) VALUES (?, ?, ?, ?, ?, ?)', 
            customerData.customerSessionIdentifier, customerData.socketIDs, customerData.faqSection, customerData.faqQuestion, customerData.userId, customerData.timeConnected);
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
    console.log(customerSessionIdentifier);
    const row = await db.get('SELECT * FROM waitingCustomers WHERE customerSessionIdentifier = ?', customerSessionIdentifier);
    console.log(row);

    return row ? { ...row, socketIDs: JSON.parse(row.socketIDs) } : null;
};

export const addAvailStaff = async (db, staffData) => {
    staffData.socketIDs = JSON.stringify(staffData.socketIDs);
    await db.run('INSERT INTO availStaff (staffSessionIdentifier, socketIDs, staffID) VALUES (?, ?, ?)', 
        staffData.staffSessionIdentifier, staffData.socketIDs, staffData.staffID);
};

export const retrieveAvailStaff = async (db) => {
    const rows = await db.all('SELECT * FROM availStaff');
    return rows.map(row => ({ ...row, socketIDs: JSON.parse(row.socketIDs) }));
};

export const removeAvailStaff = async (db, staffSessionIdentifier) => {
    await db.run('DELETE FROM availStaff WHERE staffSessionIdentifier = ?', staffSessionIdentifier);
};

export const searchForAvailStaff = async (db, staffSessionIdentifier) => {
    const row = await db.get('SELECT * FROM availStaff WHERE staffSessionIdentifier = ?', staffSessionIdentifier);
    console.log("staff", row);
    return row ? { ...row, socketIDs: JSON.parse(row.socketIDs) } : null;
};

export const startActiveChat = async (db, activeChat) => {
    activeChat.customer.socketIDs = JSON.stringify(activeChat.customer.socketIDs);
    activeChat.staff.socketIDs = JSON.stringify(activeChat.staff.socketIDs);
    await db.run('INSERT INTO activeChats (caseID, customerSessionIdentifier, customerSocketIDs, faqSection, faqQuestion, userId, timeConnected, staffSessionIdentifier, staffSocketIDs, staffID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        activeChat.caseID, activeChat.customer.customerSessionIdentifier, activeChat.customer.socketIDs, activeChat.customer.faqSection, activeChat.customer.faqQuestion, activeChat.customer.userId, activeChat.customer.timeConnected, activeChat.staff.staffSessionIdentifier, activeChat.staff.socketIDs, activeChat.staff.staffID);
};

export const endActiveChat = async (db, caseID) => {
    await db.run('DELETE FROM activeChats WHERE caseID = ?', caseID);
    // TODO: Save the Chat to the Chat History DB
};

export const appendCustSIDToActiveChat = async (db, caseID, socketID) => {
    const chat = await searchActiveChat(db, caseID);
    const socketIDs = JSON.parse(chat.customerSocketIDs);
    socketIDs.push(socketID);
    await db.run('UPDATE activeChats SET customerSocketIDs = ? WHERE caseID = ?', JSON.stringify(socketIDs), caseID);
};

export const appendStaffSIDToActiveChat = async (db, caseID, socketID) => {
    const chat = await searchActiveChat(db, caseID);
    const socketIDs = JSON.parse(chat.staffSocketIDs);
    socketIDs.push(socketID);
    await db.run('UPDATE activeChats SET staffSocketIDs = ? WHERE caseID = ?', JSON.stringify(socketIDs), caseID);
};

// Search Functions
export const searchActiveChat = async (db, caseID) => {
    const row = await db.get('SELECT * FROM activeChats WHERE caseID = ?', caseID);
    return row ? { ...row, customerSocketIDs: JSON.parse(row.customerSocketIDs), staffSocketIDs: JSON.parse(row.staffSocketIDs) } : null;
};

export const searchCustomerInActiveChat = async (db, customerSessionIdentifier) => {
    const row = await db.get('SELECT * FROM activeChats WHERE customerSessionIdentifier = ?', customerSessionIdentifier);
    return row ? { ...row, customerSocketIDs: JSON.parse(row.customerSocketIDs), staffSocketIDs: JSON.parse(row.staffSocketIDs) } : null;
};

export const searchAdminInActiveChat = async (db, staffSessionIdentifier) => {
    const row = await db.get('SELECT * FROM activeChats WHERE staffSessionIdentifier = ?', staffSessionIdentifier);
    return row ? { ...row, customerSocketIDs: JSON.parse(row.customerSocketIDs), staffSocketIDs: JSON.parse(row.staffSocketIDs) } : null;
};