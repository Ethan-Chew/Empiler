import supabase from "../utils/supabase.js";
import otplib from 'otplib';

export default class otp {
    constructor(email, secretKey, otp) {
        this.email = email;
        this.secretKey = secretKey;
        this.otp = otp;
    }

    static async getOtp(email) {
        const {data, error} = await supabase
            .from('2faSecret')
            .select('secretkey')
            .eq('email', email);
        if (error) {
            throw error;
        }
        const secretKey = data[0].secretkey;
        const otpURI = otplib.authenticator.keyuri(email, 'OCBC', secretKey);

        return { secretKey, otpURI };
    }

    static async createOtp(email) {
        try {
            const secretkey = otplib.authenticator.generateSecret();
            const otpURI = otplib.authenticator.keyuri(email, 'OCBC', secretkey);
            const { data, error } = await supabase
                .from('2faSecret')
                .insert([{ email, secretkey }])
                .single();

            if (error) {
                throw error;
            }

            return { data, otpURI };
        } catch (error) {
            console.error('Error creating OTP:', error);
            return null;
        }
    }

    static async verifyOtp(email, otp) {
        console.log(email, otp);
        const { data, error } = await supabase
            .from('2faSecret')
            .select('secretkey')
            .eq('email', email);

        if (error) {
            console.log(error);
            return null;
        }

        otplib.authenticator.options = { window: 1 };

        const secretKey = data[0].secretkey;
        const isValid = otplib.authenticator.check(otp, secretKey);
        console.log(otplib.authenticator.generate(secretKey));

        return isValid;
    }

    static async deleteOtp(email) {
        const { data, error } = await supabase
            .from('2faSecret')
            .delete()
            .eq('email', email);

        if (error) {
            console.log(error);
            return null;
        }

        return data;
    }
}