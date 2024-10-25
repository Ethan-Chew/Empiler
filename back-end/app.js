import express from 'express';
import morgan from 'morgan'
import bodyParser from "body-parser";
import dotenv from "dotenv";

import supabase from './supabase.js';

// Routes
import user from './routes/user.route.js';
import chatHistory from './routes/chatHistory.route.js';
import faq from './routes/faq.route.js';

dotenv.config();

const app = express();

// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// API Routes
app.use("/api/user", user);
app.use("/api/chatHistory", chatHistory);
app.use("/api/faq", faq);

//Default routes
app.get('/', (req, res) => {
    res.send("Hello I am working my friend Supabase <3");
});

app.listen(8080, () => {
    console.log(`> Ready on http://localhost:8080`);
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