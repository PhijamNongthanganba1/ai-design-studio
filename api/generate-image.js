const axios = require('axios');

module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { prompt, width = 1024, height = 1024 } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // Using Pollinations.ai (No API Key Required)
        // Flux model is generally better quality
        const encodedPrompt = encodeURIComponent(prompt);
        const seed = Math.floor(Math.random() * 10000); // Random seed for variety
        const pollinationUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

        console.log(`Generating image via Pollinations: ${pollinationUrl}`);

        const response = await axios.get(pollinationUrl, {
            responseType: 'arraybuffer'
        });

        // Convert binary buffer to Base64 data URL
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;

        res.json({
            success: true,
            image: imageUrl,
            isMock: false,
            provider: 'pollinations'
        });

    } catch (error) {
        console.error('AI Generation Error:', error.message);

        // Fallback to mock if even Pollinations fails
        const mockImages = [
            "https://images.unsplash.com/photo-1620641788421-7f1c338e85a5?w=600",
            "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=600"
        ];
        const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];

        res.json({
            success: true,
            image: randomImage,
            isMock: true,
            error: 'AI Error: ' + (error.message || 'Unknown error')
        });
    }
};
