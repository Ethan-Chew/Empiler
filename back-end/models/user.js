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
            .from('users')
            .select('*')
            .eq('username', username);

        if (queryRequest.status !== 200) {
            console.log(queryRequest.error);
            return null;
        }

        return queryRequest.data;
    }
}