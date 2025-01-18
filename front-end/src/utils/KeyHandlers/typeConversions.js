/// Convert between Data Types
function _base64StringToArrayBuffer(b64str) {
    const byteStr = atob(b64str)
    const bytes = new Uint8Array(byteStr.length)
    for (let i = 0; i < byteStr.length; i++) {
      bytes[i] = byteStr.charCodeAt(i)
    }
    return bytes.buffer
}

function _arrayBufferToBase64(arrayBuffer) {
    const byteArray = new Uint8Array(arrayBuffer);
    let byteString = '';
    for(let i=0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    const b64 = btoa(byteString);

    return b64;
}

export { _base64StringToArrayBuffer, _arrayBufferToBase64 };