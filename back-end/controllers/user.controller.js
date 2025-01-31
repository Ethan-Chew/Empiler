import supabase from '../utils/supabase.js';

const getUser = async (req, res) => {
    try {
        // Fetch all users but exclude the password field
        const { data, error } = await supabase
            .from('user')
            .select('id, username, email, role') // Exclude 'password' field
            .eq('id', req.user.id);

        if (error) {
            return res.status(500).json({ message: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        // Handle any unexpected errors
        console.error("An unexpected error occurred:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
}

const getMonthlyChatCounts = async (req, res) => {
    try {
        const staffId = req.user.id; // Get the staff ID from the JWT
        const { month } = req.query; // Extract the month from query parameters (format: YYYY-MM)

        if (!month) {
            return res.status(400).json({ message: "Month is required in YYYY-MM format." });
        }

        const { data, error } = await supabase
            .from("chat_history")
            .select("chatLog")
            .eq("staffId", staffId);

        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ message: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No chat data found for this staff." });
        }

        // Filter and count chats by month
        const chatCount = data.reduce((count, record) => {
            const chats = record.chatLog || [];
            const filteredChats = chats.filter(chat => {
                const chatMonth = new Date(chat.timestamp).toISOString().slice(0, 7); // Extract YYYY-MM
                return chatMonth === month;
            });
            return count + filteredChats.length;
        }, 0);

        return res.status(200).json({ month, chatCount });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({ message: "An unexpected error occurred." });
    }
};

const getAverageWaitingTime = async (req, res) => {
    const staffId = req.user.id;

    try {
        const { data, error } = await supabase
            .from("chat_history")
            .select("waitTime") // Assuming `waitTime` is a field in the chat history that stores the waiting time for each chat
            .eq("staffId", staffId);

        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ message: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No waiting time data found for this staff." });
        }

        const totalWaitTime = data.reduce((total, record) => total + (record.waitTime || 0), 0);
        const averageWaitTime = totalWaitTime / data.length;

        return res.status(200).json({ averageWaitingTime: averageWaitTime.toFixed(2) });
    } catch (error) {
        console.error('Error fetching average waiting time:', error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
};


const getStaffFeedback = async (req, res) => {
    try {
        const staffId = req.user.id;
        console.log("Staff ID:", staffId); // Log staff ID to confirm JWT decoding works

        const { data, error } = await supabase
            .from('chat_history')
            .select('rating')
            .eq('staffId', staffId);

        if (error) {
            console.error("Supabase error:", error); // Debug
            return res.status(500).json({ message: error.message });
        }

        if (!data || data.length === 0) {
            console.log("No feedback found for this staff."); // Debug
            return res.status(404).json({ message: 'No feedback found for this staff.' });
        }

        const counts = {
            poor: 0,
            mediocre: 0,
            good: 0,
            excellent: 0,
        };

        data.forEach(item => {
            const rating = item.rating;
            if (rating === 1) counts.poor++;
            else if (rating === 2) counts.mediocre++;
            else if (rating === 3 || rating === 4) counts.good++;
            else if (rating === 5) counts.excellent++;
        });

        const totalRatings = counts.poor + counts.mediocre + counts.good + counts.excellent;

        const response = {
            excellentPercentage: counts.excellent,
            goodPercentage: counts.good,
            mediocrePercentage: counts.mediocre,
            poorPercentage: counts.poor,
            totalRatings,
        };

        console.log("Response data:", response); // Debug the response
        res.status(200).json(response);
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
};

export default {
    getUser,
    getStaffFeedback,
    getMonthlyChatCounts,
    getAverageWaitingTime,
}