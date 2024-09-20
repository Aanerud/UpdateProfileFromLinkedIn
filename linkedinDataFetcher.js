// linkedinDataFetcher.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const util = require('util');

async function fetchLinkedInData(accessToken) {
    let logs = '';
    const allData = {};
    const domains = [
        'PROFILE',
        'POSITIONS',
        'EDUCATION',
        'SKILLS',
        'CERTIFICATIONS',
        'PROJECTS',
        'LANGUAGES',
        'INTERESTS'
        // Add other domains if needed
    ];

    try {
        for (const domain of domains) {
            logs += `Fetching data for domain: ${domain}\n`;

            const url = `https://api.linkedin.com/rest/memberSnapshotData?q=criteria&domain=${domain}`;

            logs += `Request URL: ${url}\n`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'LinkedIn-Version': '202312'
                }
            });

            logs += `Response Status: ${response.status}\n`;
            logs += `Response Data for ${domain}:\n${util.inspect(response.data, { depth: null })}\n`;

            const data = response.data;

            if (data && data.elements && data.elements.length > 0) {
                const snapshotData = data.elements[0].snapshotData;
                allData[domain] = snapshotData;
            } else {
                logs += `No data found for domain: ${domain}\n`;
            }
        }

        // Specify the file path explicitly
        const filePath = path.join(__dirname, 'public', 'linkedinData.json');

        fs.writeFileSync(filePath, JSON.stringify(allData, null, 2));
        logs += `All LinkedIn data saved to ${filePath}\n`;

        console.log(logs);
        return logs;
    } catch (error) {
        logs += 'Error fetching LinkedIn data.\n';
        logs += `Error: ${error.response ? error.response.data.message : error.message}\n`;
        console.error(logs);
        throw new Error(logs);
    }
}

module.exports = { fetchLinkedInData };
