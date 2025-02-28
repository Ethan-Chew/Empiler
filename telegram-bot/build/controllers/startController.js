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
exports.startController = void 0;
const axios_1 = __importStar(require("axios"));
const validateUUID_1 = __importDefault(require("../utils/validateUUID"));
const bot_1 = __importDefault(require("../bot"));
const startController = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const welcomeMessage = `__*OCBC Support Bot*__\n` +
        `Hi, I am the 'official' Support Bot for OCBC, here to help you with your queries\.\n\n` +
        `*Commands*\n` +
        `- \`/start\` - Start the bot\.\n` +
        `- \`/link\` - Link the bot to your OCBC Account\.\n` +
        `- \`/unlink\` - Unlink the bot from your OCBC Account (you will not be able to access services until you re-link it\.)\n` +
        `- \`/upcoming\` - View all Upcoming Appointments\.\n\n` +
        `If you're trying to connect your account, you need to provide a verification code\.\n` +
        `Run the command in the format of \`/start verification_code\`\.`;
    yield ctx.reply(welcomeMessage, {
        parse_mode: "Markdown",
        reply_parameters: { message_id: ctx.msg.message_id },
    });
    const checkAccountLinked = yield axios_1.default.get(`http://localhost:8080/api/telegram/verify/tele/${(_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id}`);
    const accountLinkedStatus = yield checkAccountLinked.data.status;
    if (accountLinkedStatus === "success") {
        // Remove the options to Start and Link the Bot
        yield bot_1.default.api.setMyCommands([
            { command: "unlink", description: "Unlink the bot from your OCBC Account (you will not be able to access services until you re-link it.)" },
            { command: "upcoming", description: "View all Upcoming Appointments" }
        ]);
    }
    const payload = ctx.match;
    if (payload) {
        yield ctx.reply("Verifying your account...");
        try {
            if (!(0, validateUUID_1.default)(payload)) {
                yield ctx.reply("Invalid Verification Code.");
                return;
            }
            const response = yield axios_1.default.put(`http://localhost:8080/api/telegram/link`, {
                verificationCode: payload,
                telegramId: (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id,
                telegramUsername: (_c = ctx.from) === null || _c === void 0 ? void 0 : _c.username,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200) {
                yield ctx.reply("Successfully linked your account to the bot.");
                // Remove the options to Start and Link the Bot
                yield bot_1.default.api.setMyCommands([
                    { command: "unlink", description: "Unlink the bot from your OCBC Account (you will not be able to access services until you re-link it.)" },
                    { command: "upcoming", description: "View all Upcoming Appointments" }
                ]);
            }
            else {
                yield ctx.reply(response.data.message);
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof axios_1.AxiosError) {
                if ((_d = error.response) === null || _d === void 0 ? void 0 : _d.data.message) {
                    yield ctx.reply(`Error: ${error.response.data.message}`);
                    return;
                }
            }
            yield ctx.reply("An error occurred while linking your account to the bot.");
        }
    }
});
exports.startController = startController;
