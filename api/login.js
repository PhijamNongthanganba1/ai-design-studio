const crypto = require('crypto');
const connectToDatabase = require('../lib/mongodb');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

        const { db } = await connectToDatabase();
        const users = db.collection('users');
        const user = await users.findOne({
            email: email.toLowerCase(),
            password: hashPassword(password)
        });

        if (user) {
            res.json({
                success: true,
                user: { email: user.email, name: user.name, plan: user.plan }
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        if (error.message.includes('timeout') || error.message.includes('Topology') || error.message.includes('ReplicaSetNoPrimary')) {
            return res.status(500).json({
                error: 'Database connection failed. Please ensure your IP is whitelisted in MongoDB Atlas Network Access.'
            });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
