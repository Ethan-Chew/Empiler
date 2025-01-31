import otp from "../models/otp.js";

const getOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const { secretKey, otpURI, otpEnabled} = await otp.getOtp(email);

        console.log(secretKey, otpURI);
        
        if (!secretKey) {
            res.status(200).json({
                status: false
            });
        }

        res.status(200).json({
            status: 'Success',
            otpURI: otpURI,
            secretKey: secretKey,
            otpEnabled: otpEnabled
        });
    } catch (error) {
        console.error(error);
        res.status(200).json({
            status: false
        });
    }
}

const enableOtp = async (req, res) => {
    try {
        const { email, status } = req.body;
        const data = await otp.enableOtp(email, status);

        if (!data) {
            return res.status(404).json({
                status: 'Error',
                message: 'OTP not enabled.'
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'OTP status changed successfully.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

const createOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const { data, otpauth } = await otp.createOtp(email);

        if (!data) {
            return res.status(404).json({
                status: 'Error',
                message: 'OTP not created.'
            });
        }

        res.status(200).json({
            status: 'Success',
            otpauth: otpauth
        });
    } catch (error) {
        console.error(error);
        res.status(200).json({
            status: false
        });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otpCode } = req.body;
        const isValid = await otp.verifyOtp(email, otpCode);

        if (!isValid) {
            return res.status(200).json({
                status: false,
                message: 'Invalid OTP.'
            });
        }

        res.status(200).json({
            status: true,
            message: 'OTP is valid.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
} 

const deleteOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const data = await otp.deleteOtp(email);

        if (!data) {
            return res.status(200).json({
                status: 'Success',
                message: 'OTP deleted successfully.'
            });
        }
        res.status(404).json({
            status: 'Error',
            message: 'OTP not deleted.'
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'Internal Server Error',
            error: error
        });
    }
}

export default { createOtp, verifyOtp, deleteOtp, getOtp, enableOtp };