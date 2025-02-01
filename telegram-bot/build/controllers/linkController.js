"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkController = void 0;
const axios_1 = __importStar(require("axios"));
const validateUUID_1 = __importDefault(require("../utils/validateUUID"));
const bot_1 = __importDefault(require("../bot"));
const linkController = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Verify that a UUID Payload is attached
        const payload = ctx.match;
        if (!payload) {
            yield ctx.reply("You need to provide a verification code to link your account. Run the command in the format of '\\link <verification_code>'");
            return;
        }
        if (!(0, validateUUID_1.default)(payload)) {
            yield ctx.reply("Invalid Verification Code.");
            return;
        }
        // Send a Validation Request
        const response = yield axios_1.default.put(`http://localhost:8080/api/telegram/link`, {
            verificationCode: payload,
            telegramId: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id,
            telegramUsername: (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.username,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.status === 200) {
            yield ctx.reply("Successfully linked your account to the bot.");
        }
        else {
            yield ctx.reply(response.data.message);
        }
        // Remove the options to Start and Link the Bot
        yield bot_1.default.api.setMyCommands([
            { command: "unlink", description: "Unlink the bot from your OCBC Account (you will not be able to access services until you re-link it.)" },
            { command: "upcoming", description: "View all Upcoming Appointments" }
        ]);
    }
    catch (error) {
        if (error instanceof axios_1.AxiosError) {
            if ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data.message) {
                yield ctx.reply(`Error: ${error.response.data.message}`);
                return;
            }
        }
        yield ctx.reply("An error occurred while linking your account to the bot.");
    }
});
exports.linkController = linkController;
