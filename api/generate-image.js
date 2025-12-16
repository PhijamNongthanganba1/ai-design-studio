const axios = require('axios');

module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const API_KEY = process.env.HUGGINGFACE_API_KEY;

    if (!API_KEY) {
        return res.json({
            success: false,
            error: 'Missing API Key. Please add HUGGINGFACE_API_KEY to .env file.'
        });
    }

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                responseType: 'arraybuffer' // We expect binary image data
            }
        );

        // Convert binary buffer to Base64 data URL
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;

        res.json({
            success: true,
            image: imageUrl,
            isMock: false
        });

    } catch (error) {
        console.error('AI Generation Error:', error.response ? error.response.data : error.message);

        // Fallback to mock if API fails (e.g., rate limit or bad key)
        const mockImages = [
            "https://images.unsplash.com/photo-1620641788421-7f1c338e85a5?w=600",
            "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=600"
        ];
        const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];

        res.json({
            success: true,
            image: randomImage,
            isMock: true,
            error: 'AI Error (Falling back to Mock): ' + (error.message || 'Unknown error')
        });
    }
};
