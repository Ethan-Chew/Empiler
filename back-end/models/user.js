import supabase from "../utils/supabase.js";

export default class User {
    constructor(id, username, password, email, role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
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
}