import { createClient } from '@supabase/supabase-js'
import dotenv from "dotenv";

dotenv.config();

const supabaseApiKey = process.env.SUPABASE_ANON_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseApiKey);

export default supabase;