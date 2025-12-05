module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.status(200).json({
        status: 'ok',
        platform: 'Vercel',
        features: {
            auth: true,
            imageGeneration: true,
            database: 'MongoDB Atlas'
        },
        timestamp: new Date().toISOString()
    });
};
