/// Convert between Data Types
function _base64StringToArrayBuffer(base64) {
    base64 = base64.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if necessary
    while (base64.length % 4 !== 0) {
        base64 += '=';
    }

    // Decode the Base64 string into a binary string
    const binaryString = atob(base64);

    // Create a new ArrayBuffer and a Uint8Array to hold the binary data
    const buffer = new ArrayBuffer(binaryString.length);
    const view = new Uint8Array(buffer);

    // Fill the ArrayBuffer with the binary data
    for (let i = 0; i < binaryString.length; i++) {
        view[i] = binaryString.charCodeAt(i);
    }

    return buffer;
}

function _arrayBufferToBase64(buffer) {
    const view = new Uint8Array(buffer);

    // Create a binary string from the ArrayBuffer data
    let binaryString = '';
    for (let i = 0; i < view.length; i++) {
        binaryString += String.fromCharCode(view[i]);
    }

    // Encode the binary string to Base64
    return btoa(binaryString);
}

export { _base64StringToArrayBuffer, _arrayBufferToBase64 };