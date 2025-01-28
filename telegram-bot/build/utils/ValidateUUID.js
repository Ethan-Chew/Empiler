"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateUUID;
function validateUUID(verificationCode) {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!regex.test(verificationCode)) {
        return false;
    }
    return true;
}
