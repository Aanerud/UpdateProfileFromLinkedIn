const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();  // Load environment variables

const app = express();
const port = process.env.PORT || 3050;

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
        AAD_ENDPOINT: process.env.AAD_ENDPOINT
    };

    const htmlContent = injectEnvVariables(filePath, envVariables);
    res.send(htmlContent);
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
