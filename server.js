const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Use environment variable for port or default to 3000
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Store prompts in memory with a backup to a file
const PROMPTS_FILE = path.join(__dirname, 'prompts.json');
let prompts = [];

// Load any existing prompts from file
try {
    if (fs.existsSync(PROMPTS_FILE)) {
        const data = fs.readFileSync(PROMPTS_FILE, 'utf8');
        prompts = JSON.parse(data);
        console.log(`Loaded ${prompts.length} prompts from storage`);
    } else {
        // Create empty prompts file if it doesn't exist
        fs.writeFileSync(PROMPTS_FILE, JSON.stringify(prompts));
        console.log('Created empty prompts file');
    }
} catch (error) {
    console.error('Error loading prompts file:', error);
}

// Helper function to save prompts to file
function savePrompts() {
    try {
        fs.writeFileSync(PROMPTS_FILE, JSON.stringify(prompts, null, 2));
        console.log(`Saved ${prompts.length} prompts to storage`);
    } catch (error) {
        console.error('Error saving prompts to file:', error);
    }
}

// Route to serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to serve the admin dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// API endpoint to submit prompts
app.post('/submit', (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get the next ID
    const nextId = prompts.length > 0 ? Math.max(...prompts.map(p => p.id)) + 1 : 1;

    // Store the prompt with timestamp
    const promptData = {
        prompt,
        timestamp: new Date().toISOString(),
        id: nextId
    };

    prompts.push(promptData);

    // Save to file
    savePrompts();

    // Log the prompt for demonstration
    console.log('New prompt received:', promptData);

    res.json({
        message: 'Prompt received successfully',
        promptId: promptData.id
    });
});

// API endpoint to get all prompts
app.get('/prompts', (req, res) => {
    res.json(prompts);
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});