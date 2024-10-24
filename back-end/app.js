import express from 'express';
import {createClient} from '@supabase/supabase-js'
import morgan from 'morgan'
import bodyParser from "body-parser";

require("dotenv").config();

const app = express();
const supabaseApiKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;


// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseApiKey);

//Default routes
app.get('/', (req, res) => {
    res.send("Hello I am working my friend Supabase <3");
});

app.get('*', (req, res) => {
    res.send("Hello again I am working my friend to the moon and behind <3");
});

app.listen(3000, () => {
    console.log(`> Ready on http://localhost:3000`);
});


//User routes (id, username, password, email, role)
app.get('/user', async (req,res) => {
    try {
        // Fetch all users but exclude the password field
        const { data, error } = await supabase
            .from('users')
            .select('id, username, email, role'); // Exclude 'password' field

        if (error) {
            return res.status(500).json({ message: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        // Handle any unexpected errors
        res.status(500).json({ message: "An unexpected error occurred" });
    }
});

//Chat History Routes (id, customerid, staffid, chatLog)
app.get('/chatHistory', async (req,res) => {
    try {
        // Fetch all chat history entries
        const { data, error } = await supabase
            .from('chatHistory')
            .select('*'); // Select all fields

        if (error) {
            return res.status(500).json({ message: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        // Handle any unexpected errors
        res.status(500).json({ message: "An unexpected error occurred" });
    }
});


//FAQ Questions Routes (title, description, section)
app.get('/questions', async (req,res) => {
    try {
        // Fetch all FAQ questions
        const { data, error } = await supabase
            .from('questions')
            .select('*'); // Select all fields

        if (error) {
            return res.status(500).json({ message: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        // Handle any unexpected errors
        res.status(500).json({ message: "An unexpected error occurred" });
    }
});

//FAQ Section Routes (title, description)
app.get('/sections', async (req,res) => {
    try {
        // Fetch all FAQ sections
        const { data, error } = await supabase
            .from('sections')
            .select('*'); // Select all fields

        if (error) {
            return res.status(500).json({ message: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        // Handle any unexpected errors
        res.status(500).json({ message: "An unexpected error occurred" });
    }
});