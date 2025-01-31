import supabase from "../utils/supabase.js";

export default class User {
    constructor(id, username, password, email, role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    static async getUserWithId(id) {
        const queryRequest = await supabase
            .from('user')
            .select('*')
            .eq('id', id);

        if (queryRequest.error || queryRequest.data.length === 0) {
            return null;
        }
    
        return queryRequest.data[0];
    }

    static async getUserWithUsername(username) {
        const queryRequest = await supabase
            .from('user')
            .select('*')
            .eq('username', username);

        if (queryRequest.error || queryRequest.data.length === 0) {
            return null;
        }
    
        return queryRequest.data[0]; 
    }

    static async getStaffStatistics(staffID) {
        const queryRequest = await supabase
        .from("chat_history")
        .select(`
            count(caseId) as numOfTotalChats, 
            avg(rating) as averageRating
          `)
        .eq("staff_id", staffID)
        .single();

        if (queryRequest.error) {
            return null;
        }

        if (!queryRequest.data || queryRequest.data.numOfTotalChats === 0) {
            return {
                numOfTotalChats: 0,
                averageRating: null
            };
        }
    
        return queryRequest.data;
    }
}