import User from '../models/user.js';
import supabase from '../utils/supabase.js';
import { initialiseDB } from '../utils/sqliteDB.js';

let db;

(async () => {
    db = await initialiseDB();
})();

const getUser = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('user')
            .select('id, username, email, role')
            .eq('id', req.user.id);

        if (error) {
            return res.status(500).json({ message: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
}

const getUserWithId = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.getUserWithId(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        } else {
            res.status(200).json(user);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: err
        });
    }
}


const getMonthlyChatCounts = async (req, res) => {
    try {
        const staffId = req.params.id;
        const { month } = req.query;

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


        const chatCount = data.reduce((count, record) => {
            const chats = record.chatLog || [];
            const filteredChats = chats.filter(chat => {
                const chatMonth = new Date(chat.timestamp).toISOString().slice(0, 7);
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


const getStaffFeedback = async (req, res) => {
    try {
        const staffId = req.params.id;

        const { data, error } = await supabase
            .from('chat_history')
            .select('rating, chatWaitingTime')
            .eq('staffId', staffId);

        if (error) {
            console.error("Supabase error:", error); 
            return res.status(500).json({ message: error.message });
        }

        if (!data || data.length === 0) {
            console.log("No feedback found for this staff.");
            return res.status(404).json({ message: 'No feedback found for this staff.' });
        }

        const counts = {
            poor: 0,
            mediocre: 0,
            good: 0,
            excellent: 0,
        };

        let totalWaitingTime = 0;
        let totalChats = 0;

        data.forEach(item => {
            const rating = item.rating;
            const waitingTime = item.chatWaitingTime;
            if (rating === 1) counts.poor++;
            else if (rating === 2) counts.mediocre++;
            else if (rating === 3 || rating === 4) counts.good++;
            else if (rating === 5) counts.excellent++;

            if (waitingTime) {
                totalWaitingTime += waitingTime;
                totalChats++;
            }
        });

        const totalRatings = counts.poor + counts.mediocre + counts.good + counts.excellent;

        const averageWaitingTime = totalChats > 0 ? (totalWaitingTime / totalChats).toFixed(2) : null;

        const response = {
            excellentPercentage: counts.excellent,
            goodPercentage: counts.good,
            mediocrePercentage: counts.mediocre,
            poorPercentage: counts.poor,
            totalRatings,
            averageWaitingTime,
        };

        console.log("Response data:", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
};


export default {
    getUser,
    getUserWithId,
    getMonthlyChatCounts,
    getStaffFeedback,
};