const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store prompts in memory (replace with database in production)
const prompts = [];

// Route to serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to serve the admin dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API endpoint to submit prompts
app.post('/submit', (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    // Store the prompt with timestamp
    const promptData = {
        prompt,
        timestamp: new Date(),
        id: prompts.length + 1
    };

    prompts.push(promptData);

    // Log the prompt for demonstration
    console.log('New prompt received:', promptData);

    res.json({
        message: 'Prompt received successfully',
        promptId: promptData.id
    });
});

// API endpoint to get all prompts (for demonstration)
app.get('/prompts', (req, res) => {
    res.json(prompts);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});