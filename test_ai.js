const axios = require('axios');

async function testAI() {
    try {
        console.log("Testing Pollinations.ai connection...");
        const prompt = "A futuristic city";
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true`;

        console.log(`URL: ${url}`);
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        console.log(`Response Status: ${response.status}`);
        console.log(`Data Length: ${response.data.length} bytes`);
        console.log("Success!");
    } catch (error) {
        console.error("Test Failed:", error.message);
    }
}

testAI();
