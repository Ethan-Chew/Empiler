import setupIndexedDB from "./setupIndexedDB";

const rsaEncryptAlgorithm = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    extractable: true,
    hash: {
      name: "SHA-256"
    }
}

// Generate a one-time RSA Key Pair for the Client to use
/// Key Pair is stored in IndexedDB
async function generateRSAKeyPair() {
  const db = await setupIndexedDB();

  // Try to retrieve Public and Private Key
  const publicKey = await retrieveRSAKeyPair(db, "rsa-public");
  const privateKey = await retrieveRSAKeyPair(db, "rsa-private");

  // Check if the RSA Key Pair already exists
  if (publicKey && privateKey) {
    return;
  }

  // If it doesn't exist, generate a new RSA Key Pair
  const keyPair = await crypto.subtle.generateKey(
    rsaEncryptAlgorithm,
    true,
    ["encrypt", "decrypt"]
  )
  
  // Save it into IndexedDB
  const transaction = await db.transaction("rsa-keys", "readwrite");
  const store = transaction.objectStore("rsa-keys");
  store.add({ type: "rsa-public", key: keyPair.publicKey });
  store.add({ type: "rsa-private", key: keyPair.privateKey });
}

async function retrieveRSAKeyPair(db, type) {
  if (!db) {
    db = await setupIndexedDB();
  }
  const transaction = await db.transaction("rsa-keys", "readonly");
  const store = transaction.objectStore("rsa-keys");
  
  return new Promise((resolve, reject) => {
    const request = store.get(type);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function encryptDataWithRSAPublic(data) {
  const publicKey = retrieveRSAKeyPair("rsa-public");
  const encryptedData = await crypto.subtle.encrypt(
    rsaEncryptAlgorithm,
    publicKey,
    new TextEncoder().encode(data)
  )

  // Convert ArrayBuffer data to Base64
  const encryptedDataString = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
  return encryptedDataString;
}

async function decryptDataWithRSAPrivate(data) {
  const privateKey = retrieveRSAKeyPair("rsa-private");
  const decryptedData = await crypto.subtle.decrypt(
    rsaEncryptAlgorithm,
    privateKey,
    new Uint8Array(atob(data).split("").map(c => c.charCodeAt(0)))
  )

  const decodedDataString = new TextDecoder().decode(decryptedData);
  return decodedDataString;
}

export { encryptDataWithRSAPublic, decryptDataWithRSAPrivate, retrieveRSAKeyPair, generateRSAKeyPair };