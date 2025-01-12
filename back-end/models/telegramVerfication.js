import supabase from "../utils/supabase.js";

export default class telegramVerification {
    constructor(userId, telegramUsername, telegramId, verificationCode, verified) {
        this.userId = userId;
        this.telegramUsername = telegramUsername;
        this.telegramId = telegramId;
        this.verificationCode = verificationCode;
        this.verified = verified;
    }

    static async getTelegramInfo(verificationCode) {
        const { data, error } = await supabase
            .from('telegram_verification')
            .select('*')
            .eq('verificationCode', verificationCode)
            .single();

        if (error) {
            console.log(error);
            throw new Error(error.cause);
        }

        return data;
    }

    static async createTelegramInfo(userId, telegramUsername) {
        const verified = false;
        const { data, error } = await supabase
            .from('telegram_verification')
            .insert([{ userId, telegramUsername, verified }]);
        
        if (error) {
            console.log(error);
            throw new Error(error.cause);
        }

        return data;
    }

    static async linkTelegramInfo(code, teleId, teleUsername) {
        const { data, error } = await supabase.rpc('validate_telegram_user', {
            code,
            teleId,
            teleUsername
        });

        if (error) {
            throw new Error(error.message);
        }

        if (data !== 'Success') {
            throw new Error(data)
        }

        return { success: true };
    }

    static async verifyTelegramLinked(teleId) {
        const { data, error } = await supabase
            .from('telegram_verification')
            .select('*')
            .eq('telegramId', teleId)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}