import supabase from '../db/supabase';

export default class chatHistory {
    constructor(id, customerId, staffId, chatLog) {
        this.id = id;
        this.customerId = customerId;
        this.staffId = staffId;
        this.chatLog = chatLog;
    }

    static async getChatById(id) {
        const { data, error } = await supabase
            .from('chat_history')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.log(error);
            return null;
        }

        return data;
    }

    static async getChatByCustomerId(customerId) {
        const { data, error } = await supabase
            .from('chat_history')
            .select('*')
            .eq('customerId', customerId);

        if (error) {
            console.log(error);
            return null;
        }

        return data;
    }

    static async getChatByStaffId(staffId) {
        const { data, error } = await supabase
            .from('chat_history')
            .select('*')
            .eq('staffId', staffId);

        if (error) {
            console.log(error);
            return null;
        }

        return data;
    }

    static async createChatHistory(customerId, staffId, chatLog) {
        const { data, error } = await supabase
            .from('chat_history')
            .insert([{ customerId, staffId, chatLog }])
            .single();

        if (error) {
            console.log(error);
            return null;
        }

        return data
    }

    static async deleteChatHistory() {
        const { data, error } = await supabase
            .from('chat_history')
            .delete()
            .eq('id', this.id);

        if (error) {
            console.log(error)
            return null;
        }

        return data
    }
}