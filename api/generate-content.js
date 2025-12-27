const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { type, context } = req.body;
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

    try {
        if (!GOOGLE_API_KEY) {
            console.log('[Content] No API Key. Using enhanced mock content.');
            const contents = {
                'resume': "Highly motivated Software Engineer with 5+ years of experience in building scalable web applications using React, Node.js, and cloud technologies. Proven track record of optimizing system performance and leading cross-functional teams.",
                'email': "Dear Team, I am pleased to share the latest design updates. We have focused on accessibility and modern aesthetics to ensure a premium user experience.",
                'default': "AI generated content is ready. This placeholder text would normally be replaced by a response from Google Gemini based on your specific context."
            };
            const result = contents[type] || contents['default'];
            await new Promise(resolve => setTimeout(resolve, 1500));
            return res.json({ success: true, content: result, isMock: true });
        }

        console.log(`[Content] Requesting Gemini for ${type}...`);

        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`, {
            contents: [{ parts: [{ text: `Generate a professional ${type} content based on this context: ${context || 'General purpose'}. Keep it concise and high-quality.` }] }]
        });

        const result = response.data.candidates[0].content.parts[0].text;

        res.json({
            success: true,
            content: result,
            isMock: false
        });

    } catch (error) {
        console.error('Content gen error:', error.response?.data || error.message);
        res.status(500).json({ error: 'AI Content Generation failed' });
    }
};
