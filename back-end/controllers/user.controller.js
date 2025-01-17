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
    getStaffFeedback
}