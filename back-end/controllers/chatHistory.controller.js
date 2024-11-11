import ChatHistory from "../models/chatHistory.js";

const getChatById = async (req, res) => {
    const { id } = req.params;

    try {
        const chat = await ChatHistory.getChatById(id);

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
        const chat = await ChatHistory.getChatByCustomerId(customerId);

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
        const chat = await ChatHistory.getChatByStaffId(staffId);

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
        const chat = await ChatHistory.createChatHistory(customerId, staffId, chatLog);

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

const updateChatRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;

        if (!id || !rating) {
            return res.status(400).json({
                status: 'Error',
                message: 'Missing required fields.'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                status: 'Error',
                message: 'Rating must be between 1 and 5.'
            });
        }

        const updateRequest = await ChatHistory.updateChatRating(id, rating);

        if (updateRequest) {
            return res.status(200).json({
                status: 'Success',
                message: 'Rating updated successfully.'
            });
        }

        return res.status(500).json({
            status: 'Error',
            message: 'Failed to update rating.'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
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
    updateChatRating
}