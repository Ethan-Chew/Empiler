function setupIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("KeyStorage", 1);
    
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            const rsaStore = db.createObjectStore("rsa-keys", { keyPath: "type" });
            rsaStore.createIndex("key", "key", { unique: false });
            rsaStore.createIndex("type", "type", { unique: true });

            const aesStore = db.createObjectStore("aes-keys", { keyPath: "msgId" }); 
            aesStore.createIndex("msgId", "msgId", { unique: true });
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

function clearObjectStore(storeName) {
    const request = indexedDB.open("KeyStorage", 1);
    request.onsuccess = async (event) => {
        const db = event.target.result;
        const transaction = await db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        store.clear();
    };
}

export default { setupIndexedDB, clearObjectStore };