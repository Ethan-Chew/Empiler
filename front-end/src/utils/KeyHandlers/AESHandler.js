// Generate a one-time AES Key for the Client to use to send message
/// Key is not stored, but tied to the message
async function generateAESKey() {
    const generatedKey = await crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    )
    return await crypto.subtle.exportKey("raw", generatedKey);
}

async function encryptDataWithAESKey(data, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        new TextEncoder().encode(data)
    )

    const encryptedDataString = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
    return {
        iv: iv,
        data: encryptedDataString
    };
}

async function decryptDataWithAESKey(data, iv, key) {
    const encryptedData = new Uint8Array(data.slice(12));
    const decryptedData = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        encryptedData
    )
    return new TextDecoder().decode(decryptedData);
}