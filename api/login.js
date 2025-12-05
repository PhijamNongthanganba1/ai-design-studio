// Demo mode - no database required
// Users are verified client-side only

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

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }

    // Demo mode: Accept all logins
    // Real validation happens client-side with localStorage
    res.status(200).json({
        success: true,
        user: {
            email: email.toLowerCase(),
            name: 'User',
            plan: 'free'
        },
        demo: true,
        message: 'Login successful (Demo Mode)'
    });
};
