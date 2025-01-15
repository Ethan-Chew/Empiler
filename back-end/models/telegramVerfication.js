import supabase from "../utils/supabase.js";

export default class telegramVerification {
    constructor(userId, telegramUsername, telegramId, verificationCode, verified, verifiedDate) {
        this.userId = userId;
        this.telegramUsername = telegramUsername;
        this.telegramId = telegramId;
        this.verificationCode = verificationCode;
        this.verified = verified;
        this.verifiedDate = verifiedDate;
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
            .insert([{ userId, telegramUsername, verified }])
            .select()
            .single();
        
        if (error) {
            console.log(error);
            throw new Error(error.cause);
        }

        return data;
    }

    static async linkTelegramInfo(code, teleId, teleUsername) {
        const currentUnixMs = Date.now();
        const { data, error } = await supabase.rpc('validate_telegram_user', {
            code,
            teleId,
            teleUsername,
            currentUnixMs
        });

        if (error) {
            console.log(error)
            throw new Error(error.message);
        }

        if (data !== 'Success') {
            throw new Error(data)
        }

        return { success: true };
    }

    static async unlinkTelegramInfo(userId) {
        const { error } = await supabase
            .from('telegram_verification')
            .delete()
            .eq('userId', userId);

        if (error) {
            throw new Error(error.message);
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

    static async verifyUserTelegramLinked(userId) {
        const { data, error } = await supabase
            .from('telegram_verification')
            .select('*')
            .eq('userId', userId)
            .single();

        if (error) {
            throw new Error(error.message);
        }
        
        return data;
    }
}