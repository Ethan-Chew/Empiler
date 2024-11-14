import User from '../models/user.js';

const getUser = async (req, res) => {
    try {
        // Fetch all users but exclude the password field
        const { data, error } = await supabase
            .from('user')
            .select('id, username, email, role'); // Exclude 'password' field

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

export default {
    getUser
}