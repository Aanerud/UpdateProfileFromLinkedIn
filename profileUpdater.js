// profileUpdater.js
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const util = require('util');

async function updateProfile(accessToken) {
    let logs = '';
    try {
        logs += 'Reading processed data...\n';

        // Specify the file path explicitly
        const inputFilePath = path.join(__dirname, 'public', 'llmOutput.json');
        const llmOutput = fs.readFileSync(inputFilePath, 'utf8');

        logs += `Processed data read from ${inputFilePath}\n`;

        const profileData = JSON.parse(llmOutput);

        logs += 'Making PATCH request to Microsoft Graph API...\n';

        const url = 'https://graph.microsoft.com/beta/me/profile';
        logs += `Request URL: ${url}\n`;
        logs += `Request Body:\n${util.inspect(profileData, { depth: null })}\n`;

        const response = await axios.patch(url, profileData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        logs += `Response Status: ${response.status}\n`;
        logs += `Response Data:\n${util.inspect(response.data, { depth: null })}\n`;

        logs += 'Profile updated successfully.\n';

        console.log(logs);
        return logs;
    } catch (error) {
        logs += 'Error updating profile.\n';
        logs += `Error: ${error.response ? error.response.data : error.message}\n`;
        console.error(logs);
        throw new Error(logs);
    }
}

module.exports = { updateProfile };
