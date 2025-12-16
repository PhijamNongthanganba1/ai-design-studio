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
        // Using Pollinations.ai (Reliable Redirect Method)
        const styleMap = {
            'enhance': 'enhanced, highly detailed, sharp focus, 8k, uhd',
            'photographic': 'photorealistic, realistic, 8k, raw photo, photography, dslr, soft lighting',
            'digital-art': 'digital art, concept art, trending on artstation, vivid colors, fantasy art',
            '3d-model': '3d render, blender, unreal engine, octane render, isometric, low poly',
            'anime': 'anime style, studio ghibli, makoto shinkai, vibrant colors, detailed line art, manga'
        };

        // Get style keywords or default to empty
        const styleKeywords = styleMap[req.body.style] || '';

        // Combine prompt with style
        const finalPrompt = styleKeywords ? `${prompt}, ${styleKeywords}` : prompt;
        const encodedPrompt = encodeURIComponent(finalPrompt);

        // Add random seed to URL to ensure unique images for same prompt
        const seed = Math.floor(Math.random() * 999999);
        const pollinationUrl = `https://pollinations.ai/p/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

        console.log(`Generating image via Pollinations: ${pollinationUrl} (Style: ${req.body.style || 'None'})`);

        const response = await axios.get(pollinationUrl, {
            responseType: 'arraybuffer',
            headers: {
                // Mimic browser to avoid blocking
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            timeout: 25000 // 25s timeout
        });

        // Convert binary buffer to Base64 data URL
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;

        res.json({
            success: true,
            image: imageUrl,
            isMock: false,
            provider: 'pollinations',
            styleApplied: req.body.style
        });

    } catch (error) {
        console.error('AI Generation Error:', error.message);

        // ROBUST FALLBACK:
        // Try to get 2 keywords from prompt for Unsplash
        const fallbackKeywords = encodeURIComponent(prompt.split(' ').slice(0, 2).join(','));
        const safeFallback = "https://images.unsplash.com/photo-1620641788421-7f1c338e85a5?w=600";

        res.json({
            success: true, // Return success so frontend displays the image
            image: safeFallback,
            isMock: true,
            error: null, // Don't trigger frontend error alert
            message: 'AI Service Busy - Showing Fallback'
        });
    }
};
