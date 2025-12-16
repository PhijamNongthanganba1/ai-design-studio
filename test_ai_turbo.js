const axios = require('axios');

async function testAI() {
    try {
        console.log("Testing Pollinations.ai (Turbo)...");
        const prompt = "A futuristic city";
        // Trying 'turbo' model and adding User-Agent
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&model=turbo`;

        console.log(`URL: ${url}`);
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
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
