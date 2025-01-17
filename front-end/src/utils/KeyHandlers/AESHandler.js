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
    const ivBase64 = btoa(String.fromCharCode(...iv));

    return {
        iv: ivBase64,
        data: encryptedDataString
    };
}

async function decryptDataWithAESKey(data, iv, key) {
    const rawKey = Uint8Array.from(atob(key), (c) => c.charCodeAt(0));

    const aesKey = await crypto.subtle.importKey(
        "raw",
        rawKey,
        { name: "AES-GCM" },
        true,
        ["decrypt"]
    );

    // Decode Base64 to ArrayBuffer
    const encryptedData = Uint8Array.from(atob(data), c => c.charCodeAt(0));
    const ivArrayBuffer = Uint8Array.from(atob(iv), c => c.charCodeAt(0));

    const decryptedData = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: ivArrayBuffer
        },
        aesKey,
        encryptedData,
    )
    return new TextDecoder().decode(decryptedData);
}