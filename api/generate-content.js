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

    const { type, context } = req.body;

    let content = '';
    if (type === 'resume') {
        const templates = [
            "Results-driven professional with proven expertise in delivering high-impact solutions. Strong analytical and problem-solving skills combined with excellent communication abilities.",
            "Accomplished professional with a track record of exceeding expectations. Skilled in strategic planning, team leadership, and driving operational excellence.",
            "Dynamic and innovative professional with extensive experience in project management and cross-functional collaboration."
        ];
        content = templates[Math.floor(Math.random() * templates.length)];
    } else {
        content = "Professional design suggestion: Consider using complementary colors and maintaining consistent spacing for a polished look.";
    }

    res.status(200).json({
        success: true,
        content: content,
        message: 'Generated using templates'
    });
};
