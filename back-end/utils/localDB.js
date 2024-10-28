import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

export const initialiseDB = async () => {
    const defaultData = {
        waitingCustomers: [],
        availStaff: [],
        activeChats: [],
    }
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const file = join(__dirname, 'db.json')

    const adapter = new JSONFile(file)
    return new Low(adapter, defaultData)
}

// Create, Read and Delete Waiting Customers
/*
customerData
- socketId: String
- faqSection: String
- faqQuestion: String
*/
export const addWaitingCustomers = async (db, customerData) => {
    db.data.waitingCustomers.push(customerData)
    await db.write()
}
export const retrieveWaitingCustomers = async (db) => {
    await db.read()
    return db.data.waitingCustomers;
}
export const removeWaitingCustomer = async (db, customerSocketId) => {
    db.data.waitingCustomers = db.data.waitingCustomers.filter(
        (customer) => customer.socketId !== customerSocketId
    )
    await db.write()
}

// Create, Read and Delete Available Staff
/*
staffData
- socketId: String
- staffId: String
*/
export const addAvailStaff = async (db, staffData) => {
    db.data.availStaff.push(staffData)
    await db.write()
}
export const retrieveAvailStaff = async (db) => {
    await db.read()
    return db.data.availStaff;
}
export const removeAvailStaff = async (db, staffSocketId) => {
    db.data.availStaff = db.data.availStaff.filter(
        (staff) => staff.socketId !== staffSocketId
    )
    await db.write()
}

// Handle Active Chats
/*
activeChat
- caseID: String
- customerSocketID: String
- staffSocketID: String
- customerID: String
- staffID: String
*/
export const startActiveChat = async (db, activeChat) => {
    db.data.activeChats.push(activeChat)
    await db.write()
}
export const endActiveChat = async (db, caseID) => {
    db.data.activeChats = db.data.activeChats.filter(
        (chat) => chat.caseID !== caseID
    )
    await db.write()

    // TODO: Save the Chat to the Chat History DB
}
export const searchActiveChat = async (db, caseID) => {
    await db.read()
    return db.data.activeChats.find((chat) => chat.caseID === caseID)
}