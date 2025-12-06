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

    // Mock implementation - in production this would use an external API like remove.bg
    console.log('🔧 Background removal requested (returning original)');

    // In a real Vercel function handling binary data can be tricky with standard body parsers.
    // However, since this is a mock returning JSON, we just acknowledge the request.

    res.status(200).json({
        success: true,
        message: 'Background removal - use external service for production',
        isMock: true
    });
};
