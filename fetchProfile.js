const axios = require('axios');

async function fetchProfile(accessToken) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const response = await axios.get(`${process.env.GRAPH_ENDPOINT}/v1.0/me`, options);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { fetchProfile };
