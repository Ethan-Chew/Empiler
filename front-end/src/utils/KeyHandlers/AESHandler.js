import indexedDB from "./indexedDB";
import { _arrayBufferToBase64, _base64StringToArrayBuffer } from "./typeConversions";

const aesEncryptAlgorithm = { name: 'AES-GCM', length: 256 };

// Generate a one-time AES Key for the Client to use to send message
/// Key is not stored, but tied to the message
async function generateAESKey() {
    const generatedKey = await crypto.subtle.generateKey(
        aesEncryptAlgorithm,
        true,
        ["encrypt", "decrypt"]
    )
    return await crypto.subtle.exportKey("raw", generatedKey);
}

async function encryptDataWithAESKey(data, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const aesKey = await crypto.subtle.importKey(
        "raw",
        key,
        aesEncryptAlgorithm,
        true,
        ["encrypt"]
    );
    const encryptedData = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        aesKey,
        (new TextEncoder()).encode(data)
    )

    // Encode ArrayBuffer to Base64
    const encryptedDataString = _arrayBufferToBase64(encryptedData);
    const ivBase64 = _arrayBufferToBase64(iv);

    return {
        iv: ivBase64,
        data: encryptedDataString
    };
}

async function decryptDataWithAESKey(key, iv, data) {
    const aesKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "AES-GCM" },
        true,
        ["decrypt"]
    );
    // Decode Base64 to ArrayBuffer
    const encryptedData = _base64StringToArrayBuffer(data);
    const ivArrayBuffer = _base64StringToArrayBuffer(iv);

    const decryptedData = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: ivArrayBuffer
        },
        aesKey,
        encryptedData,
    )

    return (new TextDecoder()).decode(decryptedData);
}

async function saveAESKeyWithMessageId(key, iv, messageId) {
    const db = await indexedDB.setupIndexedDB();
    const transaction = await db.transaction("aes-keys", "readwrite");
    const store = transaction.objectStore("aes-keys");
    store.add({ msgId: messageId, key: _arrayBufferToBase64(key), iv: iv });
}

async function retrieveAESKeyWithMessageId(messageId) {
    const db = await indexedDB.setupIndexedDB();
    const transaction = await db.transaction("aes-keys", "readonly");
    const store = transaction.objectStore("aes-keys");

    return new Promise((resolve, reject) => {
        const request = store.get(messageId);

        request.onsuccess = (event) => {
            const formattedResult = {
                key: _base64StringToArrayBuffer(event.target.result.key),
                iv: event.target.result.iv
            }
            resolve(formattedResult);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

export default { generateAESKey, encryptDataWithAESKey, decryptDataWithAESKey, saveAESKeyWithMessageId, retrieveAESKeyWithMessageId };