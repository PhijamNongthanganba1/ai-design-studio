const { MongoClient } = require('mongodb');
const crypto = require('crypto');

// MongoDB connection
let cachedDb = null;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aidesign:AiDesign123!@ai-design-studio.c8bllig.mongodb.net/?appName=ai-design-studio';

async function connectToDatabase() {
    if (cachedDb) return cachedDb;

    const client = await MongoClient.connect(MONGODB_URI);
    cachedDb = client.db('ai-design-studio');
    return cachedDb;
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Missing email or password' });
        }

        const db = await connectToDatabase();
        const users = db.collection('users');

        const hashedPassword = hashPassword(password);
        const user = await users.findOne({
            email: email.toLowerCase(),
            password: hashedPassword
        });

        if (user) {
            res.status(200).json({
                success: true,
                user: {
                    email: user.email,
                    name: user.name,
                    plan: user.plan
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};
