// index.js
const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const session = require('express-session');
const bodyParser = require('body-parser');
const linkedinAuth = require('./linkedinAuth'); // LinkedIn auth routes
const { fetchLinkedInData } = require('./linkedinDataFetcher');
const { processWithLLM } = require('./llmProcessor');
const { updateProfile } = require('./profileUpdater');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_session_secret', // Replace with a secure secret
    resave: false,
    saveUninitialized: true
}));

// Set view engine for rendering error pages
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper function to inject environment variables into the HTML
function injectEnvVariables(filePath, envVariables) {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    Object.keys(envVariables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        fileContent = fileContent.replace(regex, envVariables[key]);
    });
    return fileContent;
}

// Serve the index.html with injected environment variables
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'index.html');
    const envVariables = {
        CLIENT_ID: process.env.CLIENT_ID,
        TENANT_ID: process.env.TENANT_ID,
        AAD_ENDPOINT: process.env.AAD_ENDPOINT,
        LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
        LINKEDIN_REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI
    };

    const htmlContent = injectEnvVariables(filePath, envVariables);
    res.send(htmlContent);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use the LinkedIn auth routes
app.use('/', linkedinAuth);

// Route to handle fetching LinkedIn data
app.get('/fetchLinkedInData', async (req, res) => {
    const accessToken = req.session.linkedinAccessToken;
    if (!accessToken) {
        return res.status(401).send('LinkedIn access token not found. Please sign in with LinkedIn.');
    }

    try {
        const logs = await fetchLinkedInData(accessToken);
        res.send(logs);
    } catch (error) {
        res.status(500).send(`Error fetching LinkedIn data: ${error.message}`);
    }
});

// Route to process data with LLM
app.get('/processLLMData', async (req, res) => {
    try {
        const logs = await processWithLLM();
        res.send(logs);
    } catch (error) {
        res.status(500).send(`Error processing data with LLM: ${error.message}`);
    }
});

// Route to update Microsoft profile
app.post('/updateProfile', async (req, res) => {
    const msAccessToken = req.session.microsoftAccessToken;
    if (!msAccessToken) {
        return res.status(401).send('Microsoft access token not found. Please sign in with Microsoft.');
    }

    try {
        const logs = await updateProfile(msAccessToken);
        res.send(logs);
    } catch (error) {
        res.status(500).send(`Error updating profile: ${error.message}`);
    }
});

// Endpoint to store Microsoft access token in session
app.post('/storeMsToken', (req, res) => {
    const { msAccessToken } = req.body;
    if (msAccessToken) {
        req.session.microsoftAccessToken = msAccessToken;
        res.send('Microsoft access token stored in session.');
    } else {
        res.status(400).send('No access token provided.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
