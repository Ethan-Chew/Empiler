import supabase from "../db/supabase";

export default class faq {
    constructor(title, description, section) {
        this.title = title;
        this.description = description;
        this.section = section;
    }

    static async createFaq(title, description, section) {
        const { data, error } = await supabase
            .from('req_asked_qns')
            .insert([{ title, description, section }])
            .single();

        if (error) {
            console.log(error);
            return null;
        }

        return data;
    }

    static async getAllFaqs() {
        const { data, error } = await supabase
            .from('req_asked_qns')
            .select('title, description');

        if (error) {
            console.log(error);
            return null;
        }

        return data;
    }

    static async getFaqByTitle(title) {
        const { data, error } = await supabase
            .from('req_asked_qns')
            .select('*')
            .eq('title', title)
            .single();
        
        if (error) {
            console.log(error);
            return null;
        }
        
        return data;
    }

    static async getFaqBySection(section) {
        const { data, error } = await supabase
            .from('req_asked_qns')
            .select('*')
            .eq('section', section);
        
        if (error) {
            console.log(error);
            return null;
        }
        
        return data;
    }

    static async updateFaq(title, description, section) {
        const { data, error } = await supabase
            .from('req_asked_qns')
            .update({ description, section })
            .eq('title', title)
            .single();

        if (error) {
            console.log(error);
            return null;
        }

        return data;
    }


    static async deleteFaq(title) {
        const { data, error } = await supabase
            .from('req_asked_qns')
            .delete()
            .eq('title', title)
            .single();

        if (error) {
            console.log(error);
            return null;
        }

        return data;
    }
}