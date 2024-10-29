import chatHistory from "../models/chatHistory";

const getChatById = async (req, res) => {
    const { id } = req.params;

    try {
        const chat = await chatHistory.getChatById(id);

        if (!chat) {
            return res.status(404).json({
                status: 'Error',
                message: `Chat with id ${id} not found.`
            });
        }

        res.status(200).json({
            status: 'Success',
            chat: chat
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

const getChatByCustomerId = async (req, res) => {
    const { customerId } = req.params;

    try {
        const chat = await chatHistory.getChatByCustomerId(customerId);

        if (!chat) {
            return res.status(404).json({
                status: 'Error',
                message: `Chat with customerId ${customerId} not found.`
            });
        }

        res.status(200).json({
            status: 'Success',
            chat: chat
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

const getChatByStaffId = async (req, res) => {
    const { staffId } = req.params;

    try {
        const chat = await chatHistory.getChatByStaffId(staffId);

        if (!chat) {
            return res.status(404).json({
                status: 'Error',
                message: `Chat with staffId ${staffId} not found.`
            });
        }

        res.status(200).json({
            status: 'Success',
            chat: chat
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

const createChatHistory = async (req, res) => {
    const { customerId, staffId, chatLog } = req.body;

    try {
        const chat = await chatHistory.createChatHistory(customerId, staffId, chatLog);

        if (!chat) {
            return res.status(500).json({
                status: 'Error',
                message: 'Failed to create chat history.'
            });
        }

        res.status(201).json({
            status: 'Success',
            message: 'Chat history created successfully.',
            chat: chat
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

const deleteChatHistory = async (req, res) => {
    const { id } = req.params;

    try {
        const chat = await chatHistory.deleteChatHistory(id);

        if (!chat) {
            return res.status(404).json({
                status: 'Error',
                message: `Chat with id ${id} not found.`
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'Chat history deleted successfully.',
            chat: chat
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

export default {
    getChatById,
    getChatByCustomerId,
    getChatByStaffId,
    createChatHistory,
    deleteChatHistory
}