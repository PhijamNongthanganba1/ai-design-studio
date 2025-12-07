const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (!MONGODB_URI) {
        return res.status(500).json({
            status: 'error',
            message: 'MONGODB_URI is undefined in environment variables.'
        });
    }

    try {
        const client = await MongoClient.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        const db = client.db('ai-design-studio');
        await db.command({ ping: 1 });
        await client.close();

        res.status(200).json({
            status: 'success',
            message: 'Successfully connected to MongoDB!',
            uri_preview: MONGODB_URI.substring(0, 15) + '...'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Connection failed',
            error_name: error.name,
            error_message: error.message,
            error_code: error.code,
            details: JSON.stringify(error, Object.getOwnPropertyNames(error))
        });
    }
};
