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
/// waitingCustomers is an array of Objects, with the following structure:
/*
{
    "customerSessionIdentifier": "some identifier",
    "socketIDs": [""],
    "faqSection": "some section",
    "faqQuestion": "some question",
    "userId": "Customer User ID (nullable)",
    "timeConnected": "timestamp (unix miliseconds)"
}
*/
export const addWaitingCustomers = async (db, customerData) => {
    const customerProfile = await searchForWaitingCustomer(db, customerData.csi);

    if (customerProfile) {
        customerProfile.socketIDs.push(customerData.socketId);
    } else {
        customerData.socketIDs = [customerData.socketId];
        delete customerData.socketId;
        db.data.waitingCustomers.push(customerData)
    }

    await db.write()
}
export const retrieveWaitingCustomers = async (db) => {
    await db.read()
    return db.data.waitingCustomers;
}
export const removeWaitingCustomer = async (db, customerSessionIdentifier) => {
    db.data.waitingCustomers = db.data.waitingCustomers.filter(
        (customer) => customer.csi !== customerSessionIdentifier
    )
    await db.write()
}
export const searchForWaitingCustomer = async (db, customerSessionIdentifier) => {
    await db.read()
    return db.data.waitingCustomers.find(
        (customer) => customer.customerSessionIdentifier === customerSessionIdentifier
    )
}

// Create, Read and Delete Available Staff
/// availStaff is an array of Objects, with the following structure:
/*
{
    "sstaffSessionIdentifier": "some identifier",
    "socketIDs": [""],
    "staffID": "Staff User ID (nullable)"
}
*/
export const addAvailStaff = async (db, staffData) => {
    db.data.availStaff.push(staffData)
    await db.write()
}
export const retrieveAvailStaff = async (db) => {
    await db.read()
    return db.data.availStaff;
}
export const removeAvailStaff = async (db, staffSessionIdentifier) => {
    db.data.availStaff = db.data.availStaff.filter(
        (staff) => staff.ssi !== staffSessionIdentifier
    )
    await db.write()
}
export const searchForAvailStaff = async (db, staffSessionIdentifier) => {
    await db.read()
    return db.data.availStaff.find(
        (staff) => staff.staffSessionIdentifier === staffSessionIdentifier
    )
}

// Handle Active Chats
/*
activeChat
- caseID: String
- csi: String
- ssi: String
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