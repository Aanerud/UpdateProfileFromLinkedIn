// llmProcessor.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function processWithLLM() {
    let logs = '';
    try {
        logs += 'Reading LinkedIn data...\n';

        // Read the JSON file with all LinkedIn data
        const inputFilePath = path.join(__dirname, 'public', 'linkedinData.json');
        const linkedInData = fs.readFileSync(inputFilePath, 'utf8');

        logs += `LinkedIn data read from ${inputFilePath}\n`;

        const prompt = `
You are an assistant that helps map LinkedIn data to Microsoft Graph Profile API schema.

Given the following LinkedIn data in JSON format:

${linkedInData}

Please extract the relevant information and format it as a JSON object compatible with the Microsoft Graph Profile API.

Ensure that:
- You map the data to the appropriate fields (names, positions, educationalActivities, skills, certifications, projects, languages, interests, websites).
- The output JSON should be ready to be used in a POST/PATCH request to https://graph.microsoft.com/beta/me/profile.

Provide the output as a JSON object.

`;

        logs += 'Sending data to LLM...\n';

        const llmUrl = 'http://127.0.0.1:11434/api/generate';
        logs += `LLM Endpoint: ${llmUrl}\n`;

        // Prepare the request payload as per Ollama API
        const requestData = {
            model: 'llama3.1',
            prompt: prompt,
            stream: false // Set to false to get the response in a single reply
        };

        logs += `Request Data:\n${JSON.stringify(requestData, null, 2)}\n`;

        // Make the POST request to Ollama API
        const response = await axios.post(llmUrl, requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        logs += `LLM Response Status: ${response.status}\n`;
        logs += `LLM Response Data:\n${JSON.stringify(response.data, null, 2)}\n`;

        // The response data contains the generated text in response.data.response
        const llmOutput = response.data.response;

        // Specify the output file path
        const outputFilePath = path.join(__dirname, 'public', 'llmOutput.json');
        fs.writeFileSync(outputFilePath, llmOutput);
        logs += `Processed data saved to ${outputFilePath}\n`;

        console.log(logs);
        return logs;
    } catch (error) {
        logs += 'Error processing data with LLM.\n';
        logs += `Error: ${error.response ? JSON.stringify(error.response.data, null, 2) : error.message}\n`;
        console.error(logs);
        throw new Error(logs);
    }
}

module.exports = { processWithLLM };
