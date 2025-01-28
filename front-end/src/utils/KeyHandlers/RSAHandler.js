import IndexedDB from "./indexedDB";
import { _arrayBufferToBase64, _base64StringToArrayBuffer } from "./typeConversions";

const rsaEncryptAlgorithm = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    extractable: true,
    hash: {
      name: "SHA-256"
    }
}

// Helper Conversion Functions
function addNewLines(str) {
  let finalString = '';
  while(str.length > 0) {
      finalString += str.substring(0, 64) + '\n';
      str = str.substring(64);
  }

  return finalString;
}

/// Convert Key from Array Buffer to Private Key PEM
function toPrivatePem(privateKey) {
  const b64Txt = addNewLines(_arrayBufferToBase64(privateKey));
  const pem = "-----BEGIN RSA PRIVATE KEY-----\n" + b64Txt + "-----END RSA PRIVATE KEY-----";
  
  return pem;
}
/// Convert Key from Array Buffer to Public Key PEM
function toPublicPem(privateKey) {
  const b64 = addNewLines(_arrayBufferToBase64(privateKey));
  const pem = "-----BEGIN PUBLIC KEY-----\n" + b64 + "-----END PUBLIC KEY-----";
  
  return pem;
}
/// Convert from a Key PEM to Array Buffer
function convertPemToBinary(pem) {
  const lines = pem.split('\n')
  let encoded = ''
  for(let i = 0;i < lines.length;i++){
    if (lines[i].trim().length > 0 &&
        lines[i].indexOf('-----BEGIN RSA PRIVATE KEY-----') < 0 &&
        lines[i].indexOf('-----BEGIN PUBLIC KEY-----') < 0 &&
        lines[i].indexOf('-----END RSA PRIVATE KEY-----') < 0 &&
        lines[i].indexOf('-----END PUBLIC KEY-----') < 0) {
      encoded += lines[i].trim()
    }
  }
  return _base64StringToArrayBuffer(encoded)
}

// Generate a one-time RSA Key Pair for the Client to use
/// Key Pair is stored in IndexedDB
async function generateRSAKeyPair() {
  const db = await IndexedDB.setupIndexedDB();

  // Try to retrieve Public and Private Key
  const publicKey = await retrieveRSAKeyPair("rsa-public");
  const privateKey = await retrieveRSAKeyPair("rsa-private");

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

  // Export the Private and Public Keys
  let privateKeyPem, publicKeyPem;
  const exportedPrivateKey = await window.crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey
  )
  privateKeyPem = toPrivatePem(exportedPrivateKey);
    
  const exportedPublicKey = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  )
  publicKeyPem = toPublicPem(exportedPublicKey);
  
  // Save it into IndexedDB
  const transaction = await db.transaction("rsa-keys", "readwrite");
  const store = transaction.objectStore("rsa-keys");
  store.add({ type: "rsa-public", key: publicKeyPem });
  store.add({ type: "rsa-private", key: privateKeyPem });
}

async function retrieveRSAKeyPair(type) {
  let database = await IndexedDB.setupIndexedDB();
  const transaction = await database.transaction("rsa-keys", "readonly");
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

async function encryptDataWithRSAPublic(data, publicKey) {
  const keyArrayBuffer = convertPemToBinary(publicKey);
  const key = await crypto.subtle.importKey(
    'spki',
    keyArrayBuffer,
    rsaEncryptAlgorithm,
    true,
    ["encrypt"]
  )
  const encryptedData = await crypto.subtle.encrypt(
    rsaEncryptAlgorithm,
    key,
    data
  )

  // Convert ArrayBuffer data to Base64
  const encryptedDataString = _arrayBufferToBase64(encryptedData);
  return encryptedDataString;
}

async function decryptDataWithRSAPrivate(data) {
  const rsaPrivatePem = await retrieveRSAKeyPair("rsa-private");
  const privateKey = convertPemToBinary(rsaPrivatePem.key);
  const secretKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKey,
    rsaEncryptAlgorithm,
    true,
    ['decrypt']
  );
  const decryptedData = await crypto.subtle.decrypt(
    rsaEncryptAlgorithm,
    secretKey,
    _base64StringToArrayBuffer(data)
  )
  return decryptedData;
}

export default { encryptDataWithRSAPublic, decryptDataWithRSAPrivate, retrieveRSAKeyPair, generateRSAKeyPair };