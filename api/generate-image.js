const axios = require('axios');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt, style, width, height } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Use Pollinations.ai for FREE AI image generation
        const encodedPrompt = encodeURIComponent(prompt + ' ' + (style || ''));
        const aiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width || 1024}&height=${height || 1024}&nologo=true`;

        const imageResponse = await axios.get(aiUrl, {
            responseType: 'arraybuffer',
            timeout: 60000 // 60 second timeout
        });

        const base64 = Buffer.from(imageResponse.data).toString('base64');

        res.status(200).json({
            success: true,
            image: `data:image/jpeg;base64,${base64}`,
            message: 'Generated using Free AI (Pollinations.ai)'
        });
    } catch (error) {
        console.error('Image generation error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Image generation failed'
        });
    }
};
