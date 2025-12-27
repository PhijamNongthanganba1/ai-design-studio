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
        // Using Pollinations.ai (URL Construction Method)
        // Vercel Free Tier has 10s timeout, so we CANNOT wait for the image to download here.
        // Instead, we construct the URL and let the Frontend load it directly.

        const styleMap = {
            'enhance': 'enhanced, highly detailed, sharp focus, 8k, uhd',
            'photographic': 'photorealistic, realistic, 8k, raw photo, photography, dslr, soft lighting',
            'digital-art': 'digital art, concept art, trending on artstation, vivid colors, fantasy art',
            '3d-model': '3d render, blender, unreal engine, octane render, isometric, low poly',
            'anime': 'anime style, studio ghibli, makoto shinkai, vibrant colors, detailed line art, manga'
        };

        const styleKeywords = styleMap[req.body.style] || '';
        const finalPrompt = styleKeywords ? `${prompt} ${styleKeywords}` : prompt; // Simplified spacing
        const encodedPrompt = encodeURIComponent(finalPrompt.trim());

        // Add random seed to URL to ensure unique images for same prompt
        const seed = Math.floor(Math.random() * 999999);
        const pollinationUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

        console.log(`[Backend] Pollination URL: ${pollinationUrl}`);

        // Pollinations.ai supports CORS (*), so we DON'T need a proxy.
        // Direct access is faster and more reliable.
        res.json({
            success: true,
            image: pollinationUrl,
            original: pollinationUrl,
            isMock: false,
            provider: 'pollinations'
        });



    } catch (error) {
        console.error('AI Processing Error:', error.message);

        // ROBUST FALLBACK URL (Using Unsplash + Proxy just in case)
        const fallbackKeywords = encodeURIComponent(prompt.split(' ').slice(0, 2).join(','));
        const unsplashUrl = `https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1024&auto=format&fit=crop`; // Specific reliable image
        const safeFallback = `https://wsrv.nl/?url=${encodeURIComponent(unsplashUrl)}&output=jpg`;

        res.json({
            success: true,
            image: safeFallback,
            isMock: true,
            error: null,
            message: 'Fallback Image'
        });
    }
};

