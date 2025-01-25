import telegramVerification from "../../models/telegramVerfication.js";

const linkAccount = async (req, res) => {
    try {
        const { verificationCode, telegramId, telegramUsername } = req.body;
        if (!verificationCode || !telegramId || !telegramUsername) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields"
            });
        }

        // Validate UUID
        const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!regex.test(verificationCode)) {
            throw new Error("Invalid Verification Code.");
        }

        const telegramInfo = await telegramVerification.linkTelegramInfo(verificationCode, telegramId, telegramUsername);
        if (telegramInfo.success != true) {
            throw new Error("Failed to link account");
        }
        
        return res.status(200).json({
            status: "success",
            data: telegramInfo
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

const unlinkAccount = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields"
            });
        }

        await telegramVerification.unlinkTelegramInfo(userId);
        
        return res.status(200).json({
            status: "success"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

const createTelegramInfo = async (req, res) => {
    try {
        const { userId, telegramUsername } = req.body;

        if (!userId || !telegramUsername) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields"
            });
        }

        const telegramInfo = await telegramVerification.createTelegramInfo(userId, telegramUsername);

        return res.status(200).json({
            status: "success",
            data: telegramInfo
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

const getTelegramInfo = async (req, res) => {
    try {
        const { verificationCode } = req.params;

        if (!verificationCode) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields"
            });
        }

        const telegramInfo = await telegramVerification.getTelegramInfo(verificationCode);
        if (telegramInfo == null) {
            return res.status(404).json({
                status: "error",
                message: "Verification code not found"
            });
        }

        return res.status(200).json({
            status: "success",
            data: telegramInfo
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

const verifyTelegramLinked = async (req, res) => {
    try {
        const { telegramId } = req.params;

        if (!telegramId) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields"
            });
        }

        const telegramInfo = await telegramVerification.verifyTelegramLinked(telegramId);
        if (telegramInfo == null) {
            return res.status(404).json({
                status: "error",
                message: "You need to link your account before you can view upcoming appointments"
            });
        }

        if (!telegramInfo.verified) {
            return res.status(200).json({
                status: "pending",
            });
        }

        return res.status(200).json({
            status: "success",
            data: telegramInfo
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

const verifyUserTelegramLinked = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields"
            });
        }

        const telegramInfo = await telegramVerification.verifyUserTelegramLinked(userId);
        if (telegramInfo == null) {
            return res.status(404).json({
                status: "error",
                message: "Account not linked"
            });
        }

        if (!telegramInfo.verified) {
            return res.status(200).json({
                status: "pending",
                data: telegramInfo
            });
        }

        return res.status(200).json({
            status: "success",
            data: telegramInfo
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

export default {
    linkAccount,
    unlinkAccount,
    createTelegramInfo,
    getTelegramInfo,
    verifyTelegramLinked,
    verifyUserTelegramLinked,
};