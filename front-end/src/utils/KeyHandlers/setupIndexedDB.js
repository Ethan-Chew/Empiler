export default function setupIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("KeyStorage", 1);
    
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            const rsaStore = db.createObjectStore("rsa-keys", { keyPath: "type" });
            rsaStore.createIndex("key", "key", { unique: false });
            rsaStore.createIndex("type", "type", { unique: true });

            const aesStore = db.createObjectStore("aes-keys", { keyPath: "id", autoIncrement: true }); 
            aesStore.createIndex("chatId", "chatId", { unique: false });
            aesStore.createIndex("key", "key", { unique: false });
            aesStore.createIndex("iv", "iv", { unique: false });
            aesStore.createIndex("timestamp", "timestamp", { unique: false });
        };
    
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}  