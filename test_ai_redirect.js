const axios = require('axios');

async function testAI() {
    try {
        console.log("Testing Pollinations.ai (Redirect Method)...");
        const prompt = "futuristic_city";
        const url = `https://pollinations.ai/p/${prompt}`;

        console.log(`URL: ${url}`);
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        console.log(`Response Status: ${response.status}`);
        console.log(`Data Length: ${response.data.length} bytes`);
        console.log("Success!");
    } catch (error) {
        console.error("Test Failed:", error.message);
        if (error.response) console.error("Status:", error.response.status);
    }
}

testAI();
