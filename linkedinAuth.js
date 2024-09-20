// linkedinAuth.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

// Route to initiate LinkedIn authentication
router.get('/auth/linkedin', (req, res) => {
    const scope = 'r_dma_portability_self_serve';
    const state = 'random_string'; // Replace with a secure random string in production
    const authURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}&scope=${scope}&state=${state}`;

    res.send({ authURL });
});

// Callback route for LinkedIn
router.get('/auth/linkedin/callback', async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    // Exchange authorization code for access token
    try {
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: LINKEDIN_REDIRECT_URI,
                client_id: LINKEDIN_CLIENT_ID,
                client_secret: LINKEDIN_CLIENT_SECRET
            }
        });

        const accessToken = tokenResponse.data.access_token;
        // Store the access token in session
        req.session.linkedinAccessToken = accessToken;

        // Close the popup window and notify the main window
        res.send(`<script>
            window.opener.linkedinAuthSuccess();
            window.close();
        </script>`);

    } catch (error) {
        console.error('Error getting LinkedIn access token:', error.response ? error.response.data : error.message);
        res.send(`<script>
            window.opener.linkedinAuthFailure('${error.message}');
            window.close();
        </script>`);
    }
});

module.exports = router;
