import supabase from '../utils/supabase.js';
import User from '../models/user.js';

const getUserWithId = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.getUserWithId(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        } else {
            res.status(200).json(user);
        }
    } catch (err){
        console.error(err);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: err
        });
    }
}

export default {
    getUserWithId
}